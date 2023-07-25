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

export default class SetKeyPoint extends CVNodeProcess {
  index: Int = 0;
  async initialize() {
    this.index = this.cvnode.parameters[0].value as Int;
  }

  async execute() {
    let input = { ...this.vars[this.cvnode.inputs[0].connection!.id] };
    let keypoint = { ...this.vars[this.cvnode.inputs[1].connection!.id] };
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    if (keypoint == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }

    input.keypoints[this.index] = keypoint;

    this.vars[this.cvnode.outputs[0].id] = input;
  }
}
