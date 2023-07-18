import { getProjectVersion } from "./api";
import {
  CVNode,
  CVNodeProcess,
  CVPipeline,
  Project,
  Version,
} from "./base_structs";
import { initProcess } from "./operations";

export class KMLPipeline {
  projectName: string;
  projectVersion: number;
  project?: Project;
  version?: Version;
  pipeline?: CVPipeline;
  nodes?: CVNode[];
  execNodes: { [label: string]: any } = {};

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
      let newExecNode = initProcess(node);
      initPromises.push(newExecNode.initialize());
      this.execNodes[node.label] = newExecNode;
    });
    Promise.all(initPromises);
  }

  async execute() {
    let executions = 0;
    let filledOutputs: string[] = [];
    while (executions < this.pipeline!.nodes.length) {
      if (filledOutputs.length == 0) {
        // pipeline inputs havent been processed
        // find and execute nodes that only take pipeline inputs
        // this.nodes!.forEach((node) => )
      }
    }
  }
}
