import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
//import "@tensorflow/tfjs-backend-wasm";

export default class PoseDetector2D extends CVNodeProcess {
  confidenceThreshold: number = 0.3;
  detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    scoreThreshold: this.confidenceThreshold,
  };
  detector?: poseDetection.PoseDetector;

  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();
    this.confidenceThreshold = this.cvnode.parameters[0].value as number;
    this.detectorConfig.scoreThreshold = this.confidenceThreshold;
    this.detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      this.detectorConfig
    );
  }

  async execute() {
    let detectorOutput = await this.detector
      ?.estimatePoses(this.vars[this.cvnode.inputs[0].connection!.id])
      .catch((err) => console.warn(err));
    this.vars[this.cvnode.outputs[0].id] =
      detectorOutput && detectorOutput!.length > 0
        ? (detectorOutput![0] as KPFrame)
        : DataType.NoDetections;
  }
}
