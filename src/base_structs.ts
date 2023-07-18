export type CVVariable = {
  id: string;
  name: string;
  dataType: DataType;
  value?: any;
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

  constructor(cvnode: CVNode) {
    this.cvnode = cvnode;
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
  outputs: CVVariable[];
  nodes: CVNode[];
};

export enum DataType {
  CVImage = "Image",
  KPFrame = "KPFrame",
  Vec = "Vec",
  Double = "Double",
}

export enum Platform {
  JS = "JS",
  SWIFT = "Swift",
  PYTHON = "Python",
}
