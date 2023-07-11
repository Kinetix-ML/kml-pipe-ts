import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-node-gpu'
import { CVImage, KPFrame } from '../types';
import { CVNode, CVVariable } from '../base_structs';
// import '@tensorflow/tfjs-backend-wasm';

export default class PoseDetector2D extends CVNode {
    confidenceThreshold: number = 0.3
    detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    detector?: poseDetection.PoseDetector

    constructor (name: string, operation: string, inputs: CVVariable[], outputs: CVVariable[]) {
        super(name, operation, inputs, outputs)
    }

    async initialize() {
        this.detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, this.detectorConfig);
    }

    async execute() {
        let detectorOutput = await this.detector?.estimatePoses(this.inputs[0].value as CVImage)
        this.outputs[0].value = detectorOutput as KPFrame[]
    }
}