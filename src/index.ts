import { getProjectVersion } from "./api";
import {
  CVNode,
  CVNodeProcess,
  CVPipeline,
  CVVariable,
  Project,
  Version,
} from "./base_structs";
import { initProcess } from "./operations";
import { CVImage } from "./types";

export class KMLPipeline {
  projectName: string;
  projectVersion: number;
  apiKey: string;
  project?: Project;
  version?: Version;
  pipeline?: CVPipeline;
  nodes?: CVNode[];
  execNodes: { [label: string]: any } = {};
  params: { [id: string]: any } = {};
  vars: { [id: string]: any } = {};

  constructor(projectName: string, projectVersion: number, apiKey: string) {
    this.projectName = projectName;
    this.projectVersion = projectVersion;
    this.apiKey = apiKey;
  }

  async initialize() {
    let { project, version } = await getProjectVersion(
      this.projectName,
      this.projectVersion,
      this.apiKey
    );
    this.project = project;
    this.version = version;
    this.pipeline = version.pipeline;
    this.nodes = version.pipeline.nodes;
    let initPromises: Promise<any>[] = [];
    this.pipeline.nodes.forEach((node) => {
      let newExecNode = initProcess(node, this.vars, this.params);
      initPromises.push(newExecNode.initialize());
      this.execNodes[node.label] = newExecNode;
      node.parameters.forEach((param) => {
        this.params[param.id] = param.value;
      });
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
    for (let i = 0; i < inputValues.length; i++) {
      this.vars[this.pipeline!.inputs[i].id] = inputValues[i] as CVImage;
      console.log("Set Pipeline Input Variables " + JSON.stringify(this.vars));
    }

    // run execution
    let executedNodes: CVNode[] = [];
    let readyNodes = checkReadyNodes(this.nodes!, executedNodes, this.vars);
    if (readyNodes.length == 0) throw new Error("No Nodes to Execute");
    while (executedNodes.length < this.nodes!.length) {
      if (readyNodes.length == 0) throw new Error("Nodes Not Ready");
      let nodePromises: Promise<any>[] = readyNodes.map((node) =>
        this.execNodes[node.label].execute()
      );
      await Promise.all(nodePromises);
      executedNodes.push(...readyNodes);
      readyNodes = checkReadyNodes(this.nodes!, executedNodes, this.vars);
    }

    let res = this.pipeline.outputs.map((output) => ({
      ...output,
      value: this.vars[output.connection!.id],
    }));

    // reset execution state
    clearVars(this.vars);
    return res;
  }
}

const clearVars = (vars: { [id: string]: any }) => {
  Object.keys(vars).forEach((id) => vars[id] == undefined);
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
      node.inputs.filter((input) => vars[input.connection!.id] != undefined)
        .length == node.inputs.length;
    return notExecuted && inputData;
  });