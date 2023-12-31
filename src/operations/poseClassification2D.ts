import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as tflite from "@tensorflow/tfjs-tflite";
import { CVImage, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class PoseClassification2D extends CVNodeProcess {
  classifier?: tflite.TFLiteModel;

  async initialize() {
    // load model from model url
    // console.log(
    //   "loading classifier: " + this.vars[this.cvnode.parameters[0].id]
    // );
    this.classifier = await tflite.loadTFLiteModel(
      this.vars[this.cvnode.parameters[0].id]
    );
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections)
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;

    let classifierOutput = await this.classifier?.predict(
      this.vars[this.cvnode.inputs[0].connection!.id]
    );
    this.vars[this.cvnode.outputs[0].id] = classifierOutput;
  }
}
