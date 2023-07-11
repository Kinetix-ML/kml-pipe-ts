export class CVVariable {
    name: string
    value: any

    constructor (name: string) {
        this.name = name
    }
}

export class CVNode {
    name: string
    operation: string
    inputs: CVVariable[]
    outputs: CVVariable[]

    constructor (name: string, operation: string, inputs: CVVariable[], outputs: CVVariable[]) {
        this.name = name
        this.operation = operation
        this.inputs = inputs
        this.outputs = outputs
    }

    async initialize() {}

    async execute() {}
}

export class CVPipeline {
    projectName: string
    projectID: string
    inputs: CVVariable[]
    outputs: CVVariable[]
    nodes: CVNode[][]

    constructor (projectName: string, projectID: string, inputs: CVVariable[], outputs: CVVariable[], nodes: CVNode[][]) {
        this.projectName = projectName
        this.projectID = projectID
        this.inputs = inputs
        this.outputs = outputs
        this.nodes = nodes
    }

    async initialize() {}

    async execute() {}
}