import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, KPFrame, Label } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class ThreeKPAngle extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let pt1 = this.vars[this.cvnode.inputs[0].connection!.id];
    let pt2 = this.vars[this.cvnode.inputs[1].connection!.id];
    let pt3 = this.vars[this.cvnode.inputs[2].connection!.id];

    if (
      pt1 == DataType.NoDetections ||
      pt2 == DataType.NoDetections ||
      pt3 == DataType.NoDetections
    ) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    this.vars[this.cvnode.outputs[0].id] = calc3PtAngle(pt1, pt2, pt3);
  }
}
