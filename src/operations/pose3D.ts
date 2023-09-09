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
  detectorConfig: poseDetection.BlazePoseTfjsModelConfig = {
    runtime: "tfjs",
    enableSmoothing: false,
    enableSegmentation: true,
  };
  detector?: poseDetection.PoseDetector;

  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();
    this.confidenceThreshold = this.cvnode.parameters[0].value as number;
    //this.detectorConfig.scoreThreshold = this.confidenceThreshold;
    this.detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.BlazePose,
      this.detectorConfig
    );
  }

  async execute() {
    let detectorOutput = await this.detector
      ?.estimatePoses(this.vars[this.cvnode.inputs[0].connection!.id])
      .catch((err) => console.warn(err));
    console.log(detectorOutput);
    this.vars[this.cvnode.outputs[0].id] =
      detectorOutput && detectorOutput!.length > 0
        ? ({
            ...detectorOutput![0],
            keypoints: detectorOutput![0].keypoints.map((pt) => ({
              ...pt,
              x: pt.x * 2,
              y: pt.y * 2,
            })),
          } as KPFrame)
        : DataType.NoDetections;
  }
}
