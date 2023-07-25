import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Int, KPFrame, Label } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class CreateKeyPoint extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let x = this.vars[this.cvnode.inputs[0].connection!.id];
    let y = this.vars[this.cvnode.inputs[1].connection!.id];
    let score = this.vars[this.cvnode.inputs[2].connection!.id];
    let name = this.vars[this.cvnode.inputs[3].connection!.id];

    if (x == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    if (y == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    if (score == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    if (name == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }

    this.vars[this.cvnode.outputs[0].id] = {
      x: x,
      y: y,
      score: score,
      name: name,
    } as poseDetection.Keypoint;
  }
}
