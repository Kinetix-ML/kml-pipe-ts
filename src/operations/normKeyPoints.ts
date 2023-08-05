import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Double, Int, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
import gnrm2 from "@stdlib/blas-base-gnrm2";
// import '@tensorflow/tfjs-backend-wasm';

export default class NormKeyPoints extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }

    this.vars[this.cvnode.outputs[0].id] = this.normCoords(input);
  }

  private normCoords(frame: KPFrame): KPFrame {
    let newKeypoints = frame.keypoints.map((kp) => {
      let vec = gnrm2(2, [kp.x, kp.y], 1);
      return {
        ...kp,
        x: kp.x / vec,
        y: kp.y / vec,
      };
    });
    let newFrame = { ...frame, keypoints: newKeypoints };
    return newFrame;
  }
}
