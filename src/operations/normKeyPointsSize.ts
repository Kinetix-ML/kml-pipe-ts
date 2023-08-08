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

export default class NormKeyPointsSize extends CVNodeProcess {
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
    let minY = this.findMinY(frame);
    let maxY = this.findMaxY(frame);
    let minX = this.findMinX(frame);
    let maxX = this.findMaxX(frame);
    let y = maxY - minY;
    minX = (maxX + minX) / 2 - y / 2;

    let newKeypoints = frame.keypoints.map((kp) => {
      return {
        ...kp,
        x: (kp.x - minX) / y,
        y: (kp.y - minY) / y,
      };
    });
    let newFrame = { ...frame, keypoints: newKeypoints };
    console.log(newKeypoints.map((kp) => kp.name));
    return newFrame;
  }

  private findMaxY(frame: KPFrame): number {
    let vals = frame.keypoints.slice().sort((a, b) => b.y - a.y);
    return vals[0].y;
  }

  private findMinY(frame: KPFrame): number {
    let vals = frame.keypoints.slice().sort((a, b) => a.y - b.y);
    return vals[0].y;
  }

  private findMaxX(frame: KPFrame): number {
    let vals = frame.keypoints.slice().sort((a, b) => b.x - a.x);
    return vals[0].x;
  }

  private findMinX(frame: KPFrame): number {
    let vals = frame.keypoints.slice().sort((a, b) => a.x - b.x);
    return vals[0].x;
  }
}
