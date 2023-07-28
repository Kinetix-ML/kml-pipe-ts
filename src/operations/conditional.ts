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
export default class Conditional extends CVNodeProcess {
  operator: String = "==";
  async initialize() {
    this.operator = this.cvnode.parameters[0].value as String;
  }

  async execute() {
    let input1 = this.vars[this.cvnode.inputs[0].connection!.id];
    let input2 = this.vars[this.cvnode.inputs[1].connection!.id];

    this.vars[this.cvnode.outputs[0].id] = eval(
      `'${input1}' ${this.operator} '${input2}'`
    );
  }
}
