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
import { calc3PtAngle, vectorLength } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class CalcKeyPointVelocities extends CVNodeProcess {
  buffer: KPFrame[] = [];
  times: number[] = [];
  async initialize() {}

  async execute() {
    let input = this.params[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    this.buffer.push(input);
    this.times.push(Date.now() / 1000);
    if (this.buffer.length > 2) this.buffer.slice(0, 1);
    if (this.buffer.length < 2) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    this.vars[this.cvnode.outputs[0].id] = this.calcVelocities();
  }

  private calcVelocities(): Double[] {
    let res: Double[] = [];
    let cur = this.buffer[1];
    let last = this.buffer[0];
    for (let i = 0; i < cur.keypoints.length; i++) {
      let delta = vectorLength([
        cur.keypoints[i].x - last.keypoints[i].x,
        cur.keypoints[i].y - last.keypoints[i].y,
      ]);
      let time = this.times[1] - this.times[0];
      res.push(delta / time);
    }
    return res as Double[];
  }
}
