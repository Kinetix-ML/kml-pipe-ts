import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Double, Int, KPFrame, Label } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class Clamp extends CVNodeProcess {
  min: Double = 0;
  max: Double = 100;
  async initialize() {
    this.min = this.cvnode.parameters[0].value as Double;
    this.max = this.cvnode.parameters[1].value as Double;
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    if (input < this.min) this.vars[this.cvnode.outputs[0].id] = this.min;
    if (input > this.max) this.vars[this.cvnode.outputs[0].id] = this.max;
    else this.vars[this.cvnode.outputs[0].id] = input;
  }
}
