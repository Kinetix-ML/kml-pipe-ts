// @ts-ignore
import * as roboflow from "roboflow-js";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import { CVImage, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
//import "@tensorflow/tfjs-backend-wasm";

export default class RoboflowDetect extends CVNodeProcess {
  confidenceThreshold: number = 0.5;
  overlapThreshold: number = 0.5;
  model: any;

  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();
    let modelString = this.cvnode.parameters[0].value as string;
    let version = this.cvnode.parameters[1].value as number;
    let apiKey = this.cvnode.parameters[2].value as number;
    this.confidenceThreshold = this.cvnode.parameters[3].value as number;
    this.overlapThreshold = this.cvnode.parameters[4].value as number;

    this.model = await roboflow
      .auth({
        publishable_key: apiKey,
      })
      .load({
        model: modelString,
        version: version,
      });
    this.model.configure({
      threshold: this.confidenceThreshold,
      overlap: this.overlapThreshold,
    });
  }

  async execute() {
    let modelOutput = await this.model?.detect(
      this.vars[this.cvnode.inputs[0].connection!.id] as CVImage
    );
    this.vars[this.cvnode.outputs[0].id] = modelOutput;
  }
}
