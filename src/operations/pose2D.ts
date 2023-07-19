import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-node-gpu";
import { CVImage, KPFrame } from "../types";
import { CVNode, CVNodeProcess, CVVariable, DataType } from "../base_structs";
// import '@tensorflow/tfjs-backend-wasm';

export default class PoseDetector2D extends CVNodeProcess {
  confidenceThreshold: number = 0.3;
  detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  };
  detector?: poseDetection.PoseDetector;

  async initialize() {
    this.detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      this.detectorConfig
    );
  }

  async execute() {
    let detectorOutput = await this.detector?.estimatePoses(
      this.vars[this.cvnode.inputs[0].connection!.id] as CVImage
    );
    this.vars[this.cvnode.outputs[0].id] =
      detectorOutput && detectorOutput!.length > 0
        ? (detectorOutput![0] as KPFrame)
        : DataType.NoDetections;
  }
}
