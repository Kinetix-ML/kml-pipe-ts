import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-node-gpu";
import { CVImage, KPFrame } from "../types";
import { CVNode, CVNodeProcess, CVVariable } from "../base_structs";
// import '@tensorflow/tfjs-backend-wasm';

export default class CalcJointAngles extends CVNodeProcess {
  constructor(cvnode: CVNode) {
    super(cvnode);
  }

  async initialize() {}

  async execute() {
    this.cvnode.outputs[0].value = [];
  }
}
