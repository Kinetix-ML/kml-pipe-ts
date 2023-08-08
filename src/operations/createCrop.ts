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
// import '@tensorflow/tfjs-backend-wasm';

export default class createCrop extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    let image = this.vars[this.cvnode.inputs[1].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    let w =
      "videoWidth" in image
        ? (image as HTMLVideoElement).videoWidth
        : (image as HTMLImageElement).naturalWidth;
    let h =
      "videoHeight" in image
        ? (image as HTMLVideoElement).videoHeight
        : (image as HTMLImageElement).naturalHeight;

    let minY = this.findMinY(input) / h - 0.05;
    let maxY = this.findMaxY(input) / h + 0.05;
    let minX = this.findMinX(input) / w - 0.05;
    let maxX = this.findMaxX(input) / w + 0.05;

    this.vars[this.cvnode.outputs[0].id] = [minY, minX, maxY, maxX];
  }

  private findMaxY(frame: KPFrame): number {
    let vals = frame.keypoints.sort((a, b) => (a.y >= b.y ? 1 : -1));
    return vals[0].y;
  }

  private findMinY(frame: KPFrame): number {
    let vals = frame.keypoints.sort((a, b) => (a.y <= b.y ? 1 : -1));
    return vals[0].y;
  }

  private findMaxX(frame: KPFrame): number {
    let vals = frame.keypoints.sort((a, b) => (a.x >= b.x ? 1 : -1));
    return vals[0].y;
  }

  private findMinX(frame: KPFrame): number {
    let vals = frame.keypoints.sort((a, b) => (a.x <= b.x ? 1 : -1));
    return vals[0].y;
  }
}
