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

export default class SetVecValue extends CVNodeProcess {
  index: Int = 0;
  async initialize() {
    this.index = this.cvnode.parameters[0].value as Int;
  }

  async execute() {
    let input = { ...this.vars[this.cvnode.inputs[0].connection!.id] };
    let val = { ...this.vars[this.cvnode.inputs[1].connection!.id] };
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    if (val == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }

    let res = [...input];
    res[this.index] = val;

    this.vars[this.cvnode.outputs[0].id] = res;
  }
}
