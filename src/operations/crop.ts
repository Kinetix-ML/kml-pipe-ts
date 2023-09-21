import { CVImage, Double, Int, KPFrame, Vec } from "../types/index.js";
import * as tf from "@tensorflow/tfjs-core";

import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { imageDims } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class Crop extends CVNodeProcess {
  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();
  }

  async execute() {
    let crop = this.vars[this.cvnode.inputs[0].connection!.id]; // [y1, x1, y2, x2] all between 0 and 1
    let image = this.vars[this.cvnode.inputs[1].connection!.id];
    let inputTensor = tf.expandDims(tf.browser.fromPixels(image));
    let cropShape = [inputTensor.shape[1], inputTensor.shape[2]];
    let output = tf.image.cropAndResize(
      // @ts-ignore
      inputTensor,
      tf.tensor([crop]),
      tf.cast(tf.tensor1d([0]), "int32"),
      cropShape
    );

    this.vars[this.cvnode.outputs[0].id] = tf.squeeze(output);
  }
}
