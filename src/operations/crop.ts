import { CVImage, Double, Int, KPFrame, Vec } from "../types/index.js";
import * as tf from "@tensorflow/tfjs-core";

import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class Crop extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let crop = this.vars[this.cvnode.inputs[0].connection!.id];
    let image = this.vars[this.cvnode.inputs[1].connection!.id];
    let inputTensor = tf.expandDims(tf.browser.fromPixels(image));
    let output = tf.image.cropAndResize(
      // @ts-ignore
      inputTensor,
      tf.tensor([crop]),
      tf.cast(tf.tensor1d([0]), "int32"),
      [crop[2] - crop[0], crop[3] - crop[1]]
    );

    this.vars[this.cvnode.outputs[0].id] = tf.squeeze(output);
  }
}
