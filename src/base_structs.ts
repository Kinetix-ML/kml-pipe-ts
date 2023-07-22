import { CVImage, Double, KPFrame, Vec } from "./types";

export type CVVariable = {
  id: string;
  name: string;
  dataType: DataType;
  value?: CVImage | KPFrame | Vec | Double | String;
};

export type CVVariableConnection = {
  id?: string;
  connection?: CVVariable;
  dataType: DataType;
};

export type CVNode = {
  label: string;
  operation: string;
  parameters: CVVariable[];
  inputs: [CVVariableConnection];
  outputs: [CVVariable];
  supportedPlatforms: [Platform];
};
export class CVNodeProcess {
  cvnode: CVNode;
  vars: { [id: string]: any };

  constructor(cvnode: CVNode, vars: { [id: string]: any }) {
    this.cvnode = cvnode;
    this.vars = vars;
  }

  async initialize() {}

  async execute() {}
}

export type Project = {
  id: string;
  projectName: string;
  owner: string;
  versions: number[];
};

export type Version = {
  id: string;
  projectID: string;
  version: number;
  pipeline: CVPipeline;
};

export type CVPipeline = {
  inputs: CVVariable[];
  outputs: CVVariableConnection[];
  nodes: CVNode[];
};

export enum DataType {
  CVImage = "Image",
  KPFrame = "KPFrame",
  Vec = "Vec",
  Double = "Double",
  NoDetections = "NoDetections",
  String = "String",
}

export enum Platform {
  JS = "JS",
  SWIFT = "Swift",
  PYTHON = "Python",
}
