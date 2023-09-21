import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Double, Int, KPFrame, Vec } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class KPVelocity extends CVNodeProcess {
  frameCount: Int = 10;
  buffer: KPFrame[] = [];
  async initialize() {
    this.frameCount = this.cvnode.parameters[0].value as Int;
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      this.buffer = [];
      return;
    }
    this.buffer.push(input);
    if (this.buffer.length > this.frameCount) this.buffer.shift();
    let [vx, vy] = this.averageFrameVelocities(this.buffer);
    this.vars[this.cvnode.outputs[0].id] = vx;
    this.vars[this.cvnode.outputs[1].id] = vy;
  }

  private averageFrameVelocities(buffer: KPFrame[]): Vec[] {
    let resX = buffer[0].keypoints.map(() => 0);
    let resY = buffer[0].keypoints.map(() => 0);
    for (let i = 1; i < buffer.length; i++) {
      for (let x = 0; x < resX.length; x++) {
        resX[x] =
          (resX[x] +
            (buffer[i - 1].keypoints[x].x - buffer[i].keypoints[x].x)) /
          2;
        resY[x] =
          (resX[x] +
            (buffer[i - 1].keypoints[x].x - buffer[i].keypoints[x].x)) /
          2;
      }
    }

    return [resX as Vec, resY as Vec];
  }
}
