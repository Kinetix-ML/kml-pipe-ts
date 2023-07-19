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
  project?: Project;
  version?: Version;
  pipeline?: CVPipeline;
  nodes?: CVNode[];
  execNodes: { [label: string]: any } = {};
  vars: { [id: string]: any } = {};

  constructor(projectName: string, projectVersion: number) {
    this.projectName = projectName;
    this.projectVersion = projectVersion;
  }

  async initialize() {
    let { project, version } = await getProjectVersion(
      this.projectName,
      this.projectVersion
    );
    this.project = project;
    this.version = version;
    this.pipeline = version.pipeline;
    this.nodes = version.pipeline.nodes;
    let initPromises: Promise<any>[] = [];
    this.pipeline.nodes.forEach((node) => {
      let newExecNode = initProcess(node, this.vars);
      initPromises.push(newExecNode.initialize());
      this.execNodes[node.label] = newExecNode;
    });
    await Promise.all(initPromises);
  }

  async execute(inputValues: any[]) {
    // make sure inputs are correct
    if (inputValues.length != this.pipeline?.inputs.length)
      throw new Error("[Pipeline Execution Error] Incorrect Number of Inputs");
    for (let i = 0; i < inputValues.length; i++) {
      this.vars[this.pipeline!.inputs[i].id] = inputValues[i] as CVImage;
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

    return this.pipeline.outputs.map((output) => ({
      ...output,
      value: this.vars[output.connection!.id],
    }));
  }
}

const checkReadyNodes = (
  nodes: CVNode[],
  executedNodes: CVNode[],
  vars: { [id: string]: any }
) =>
  nodes.filter(
    (node) =>
      executedNodes.filter((n) => n.label == node.label).length == 0 &&
      node.inputs.filter((input) => vars[input.connection!.id] != undefined)
        .length == node.inputs.length
  );
