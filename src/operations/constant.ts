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

export default class Constant extends CVNodeProcess {
  value: any = 0;
  async initialize() {
    this.value = this.cvnode.parameters[0].value;
  }

  async execute() {
    this.vars[this.cvnode.outputs[0].id] = this.value;
  }
}
