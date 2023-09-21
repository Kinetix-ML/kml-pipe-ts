import { CVImage, Double, Int, KPFrame, Vec } from "../types/index.js";
import * as tf from "@tensorflow/tfjs-core";

import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { bboxesToCrops, imageDims, normCrops } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class CropBBoxes extends CVNodeProcess {
  outSize: Int = 64;
  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();

    this.outSize = this.cvnode.parameters[0].value as Int; // Int
  }

  async execute() {
    let boxes = this.vars[this.cvnode.inputs[0].connection!.id]; // BBox[]
    if (boxes.length == 0) return;
    let crops = bboxesToCrops(boxes);
    let image = this.vars[this.cvnode.inputs[1].connection!.id];
    let inputTensor = tf.expandDims(tf.browser.fromPixels(image));
    inputTensor = tf.div(inputTensor, 256);
    let cropShape = [inputTensor.shape[1], inputTensor.shape[2]];
    crops = normCrops(cropShape[1] as number, cropShape[0] as number, crops);
    let output = tf.image.cropAndResize(
      // @ts-ignore
      inputTensor,
      tf.tensor(crops),
      tf.cast(tf.tensor1d(boxes.map(() => 0)), "int32"),
      [this.outSize, this.outSize]
    );
    let images = tf
      .split(output, output.shape[0], 0)
      .map((im) => tf.squeeze(im));

    // Note: cropAndResize() crops to square images resized to a specific value

    this.vars[this.cvnode.outputs[0].id] = images; // Image[]
  }
}
