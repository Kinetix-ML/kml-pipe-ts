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

export default class CreateLabel extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let x = this.vars[this.cvnode.inputs[0].connection!.id];
    let y = this.vars[this.cvnode.inputs[1].connection!.id];
    let value = this.vars[this.cvnode.inputs[2].connection!.id];

    this.vars[this.cvnode.outputs[0].id] = {
      x: x,
      y: y,
      value: value,
    } as Label;
  }
}
