import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Int, KPFrame, Label, String } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

// NOTE: typing not enforced currently
export default class Switch extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let input1 = this.vars[this.cvnode.inputs[0].connection!.id];
    let input2 = this.vars[this.cvnode.inputs[1].connection!.id];
    console.log(
      "input 1 val: " + input1 + " input 1 == true: " + (input1 == true)
    );
    if (input1 == true)
      this.vars[this.cvnode.outputs[0].id] = Object.assign(input2);
    else this.vars[this.cvnode.outputs[0].id] = undefined;
  }
}
