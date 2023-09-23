import { getProjectVersion } from "./api/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVPipeline,
  CVVariable,
  DataType,
  Project,
  Version,
} from "./base_structs/index.js";
import { NodeCatalog, initProcess } from "./operations/index.js";
import { CVImage } from "./types/index.js";

export class KMLPipeline {
  projectName: string;
  projectVersion: number;
  apiKey: string;
  project?: Project;
  version?: Version;
  pipeline?: CVPipeline;
  nodes?: CVNode[];
  execNodes: { [label: string]: any } = {};
  vars: { [id: string]: any } = {};

  constructor(projectName: string, projectVersion: number, apiKey: string) {
    this.projectName = projectName;
    this.projectVersion = projectVersion;
    this.apiKey = apiKey;
  }

  loadConfig(project: Project, version: Version) {
    this.project = project;
    this.version = version;
  }

  async initialize() {
    console.log("Pipe-TS Node Catalog: " + Object.keys(NodeCatalog));
    if (!this.project || !this.version) {
      let { project, version } = await getProjectVersion(
        this.projectName,
        this.projectVersion,
        this.apiKey
      );
      this.project = project;
      this.version = version;
    }
    this.pipeline = this.version.pipeline;
    this.nodes = this.version.pipeline.nodes;
    let initPromises: Promise<any>[] = [];
    this.pipeline.nodes
      .filter((node) => this.execNodes[node.id] == undefined)
      .forEach((node) => {
        let newExecNode = initProcess(node, this.vars);
        initPromises.push(newExecNode.initialize());
        this.execNodes[node.id] = newExecNode;
      });
    await Promise.all(initPromises);
  }

  async execute(inputValues: any[]) {
    // make sure inputs are correct
    if (inputValues.length != this.pipeline?.inputs.length)
      throw new Error(
        "[Pipeline Execution Error] Incorrect Number of Inputs. Expected: " +
          this.pipeline?.inputs.length +
          " but got: " +
          inputValues.length
      );

    // reset execution state
    clearVars(this.vars);
    for (let i = 0; i < inputValues.length; i++) {
      if (this.pipeline!.inputs[i].dataType == DataType.CVImage) {
        this.vars[this.pipeline!.inputs[i].id] = new CVImage(inputValues[i]);
      } else {
        this.vars[this.pipeline!.inputs[i].id] = inputValues[i];
      }
    }

    // run execution
    let executedNodes: CVNode[] = [];
    let readyNodes = checkReadyNodes(this.nodes!, executedNodes, this.vars);
    if (readyNodes.length == 0) throw new Error("No Nodes to Execute");
    while (readyNodes.length > 0) {
      if (readyNodes.length == 0) throw new Error("Nodes Not Ready");
      let nodePromises: Promise<any>[] = readyNodes.map((node) =>
        this.execNodes[node.id].execute()
      );
      await Promise.all(nodePromises);
      executedNodes.push(...readyNodes);
      readyNodes = checkReadyNodes(this.nodes!, executedNodes, this.vars);
    }

    let res = this.pipeline.outputs
      .filter((output) => output.connection != undefined)
      .map((output) => ({
        ...output,
        value: this.vars[output.connection!.id]
          ? Object.assign(this.vars[output.connection!.id])
          : undefined,
      }));

    return res;
  }
}

const clearVars = (vars: { [id: string]: any }) => {
  Object.keys(vars).forEach((id) => (vars[id] = undefined));
};

const checkReadyNodes = (
  nodes: CVNode[],
  executedNodes: CVNode[],
  vars: { [id: string]: any }
) =>
  nodes.filter((node) => {
    let notExecuted =
      executedNodes.filter((n) => n.label == node.label).length == 0;
    let inputData =
      node.inputs.filter(
        (input) =>
          input.connection != undefined &&
          vars[input.connection!.id] != undefined
      ).length == node.inputs.length;
    return notExecuted && inputData;
  });
