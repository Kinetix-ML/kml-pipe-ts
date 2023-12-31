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

export default class CalcJointAngles extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    let pts = input.keypoints;
    /*
    left elbow
    right elbow
    left shoulder
    right shoulder
    left hip outer
    right hip outer
    left hip inner
    right hip inner
    left knee
    right knee
    left thigh
    right thigh
    */
    let angles = [
      calc3PtAngle(pts[5], pts[7], pts[9]), // left elbow
      calc3PtAngle(pts[6], pts[8], pts[10]), // right elbow
      calc3PtAngle(pts[11], pts[5], pts[7]), // left shoulder
      calc3PtAngle(pts[12], pts[6], pts[8]), // right shoulder
      calc3PtAngle(pts[5], pts[11], pts[13]), // left hip outer
      calc3PtAngle(pts[6], pts[12], pts[14]), // right hip outer
      calc3PtAngle(pts[5], pts[11], pts[12]), // left hip inner
      calc3PtAngle(pts[6], pts[12], pts[11]), // right hip inner
      calc3PtAngle(pts[11], pts[13], pts[15]), // left knee
      calc3PtAngle(pts[12], pts[14], pts[16]), // right knee
      calc3PtAngle(pts[13], pts[11], pts[12]), // left thigh
      calc3PtAngle(pts[14], pts[12], pts[11]), // right thigh
    ];
    let labels = [
      { ...pts[7], value: Math.round(angles[0]) },
      { ...pts[8], value: Math.round(angles[1]) },
      { ...pts[5], value: Math.round(angles[2]) },
      { ...pts[6], value: Math.round(angles[3]) },
      { ...pts[11], value: Math.round(angles[4]) },
      { ...pts[12], value: Math.round(angles[5]) },
      { ...pts[11], value: Math.round(angles[6]) },
      { ...pts[12], value: Math.round(angles[7]) },
      { ...pts[13], value: Math.round(angles[8]) },
      { ...pts[14], value: Math.round(angles[9]) },
      { ...pts[11], value: Math.round(angles[10]) },
      { ...pts[12], value: Math.round(angles[11]) },
    ];
    this.vars[this.cvnode.outputs[0].id] = angles;
    this.vars[this.cvnode.outputs[1].id] = labels as Label[];
  }
}
