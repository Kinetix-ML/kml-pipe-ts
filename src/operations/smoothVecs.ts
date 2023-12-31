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

export default class SmoothVecs extends CVNodeProcess {
  frameCount: Int = 10;
  buffer: Vec[] = [];
  async initialize() {
    this.frameCount = this.cvnode.parameters[0].value as Int;
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    this.buffer.push(input);
    if (this.buffer.length > this.frameCount) this.buffer.shift();
    this.vars[this.cvnode.outputs[0].id] = this.averageFrames();
  }

  private averageFrames(): Vec {
    let res = Object.assign(this.buffer[0]);
    for (let i = 0; i < this.buffer[0].length; i++) {
      // calculate new x value using weighted average of all of the x coordinates
      let newVal =
        this.buffer.reduce((acc, cur) => acc + cur[i], 0) / this.buffer.length;
      res[i] = newVal;
    }

    return res as Vec;
  }
}
