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

// NOTE: typing not enforced currently
export default class Constant extends CVNodeProcess {
  value: any = 0;
  dataType: DataType.String = DataType.String;
  async initialize() {
    this.value = this.cvnode.parameters[0].value;
    this.dataType = this.cvnode.parameters[1].value as DataType.String;
  }

  async execute() {
    this.vars[this.cvnode.outputs[0].id] = this.value;
  }
}
