import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import {
  BBoxFrame,
  CVImage,
  Canvas,
  Double,
  Int,
  KPFrame,
} from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class DrawBBoxFrame extends CVNodeProcess {
  async initialize() {}

  // 0 - KPFrame
  // 1 - Image
  // 2 - Canvas
  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    let canvas = this.vars[this.cvnode.inputs[1].connection!.id] as Canvas;
    if (input == DataType.NoDetections) {
      return;
    }
    this.drawBboxes(input, canvas);
  }

  private drawBboxes(frame: BBoxFrame, canvas: Canvas) {
    const font = "16px sans-serif";
    let ctx = canvas.getContext("2d");

    frame.forEach(function (prediction) {
      const x = prediction.bbox.x;
      const y = prediction.bbox.y;

      const width = prediction.bbox.width;
      const height = prediction.bbox.height;

      // Draw the bounding box.
      ctx!.strokeStyle = prediction.color;
      ctx!.lineWidth = 4;
      ctx!.strokeRect(x - width / 2, y - height / 2, width, height);

      // Draw the label background.
      ctx!.fillStyle = prediction.color;
      const textWidth = ctx!.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx!.fillRect(
        x - width / 2,
        y - height / 2,
        textWidth + 8,
        textHeight + 4
      );
    });
  }
}
