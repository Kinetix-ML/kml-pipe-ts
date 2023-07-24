import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Canvas, Double, Int, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class DrawKeyPoints extends CVNodeProcess {
  async initialize() {}

  // 0 - KPFrame
  // 1 - Image
  // 2 - Canvas
  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    let image = this.vars[this.cvnode.inputs[1].connection!.id] as CVImage;
    let canvas = this.vars[this.cvnode.inputs[2].connection!.id] as Canvas;
    if (input == DataType.NoDetections) {
      return;
    }
    this.drawKeyPoints(input, image, canvas);
  }

  private drawKeyPoints(frame: KPFrame, image: CVImage, canvas: Canvas) {
    let w =
      "videoWidth" in image
        ? (image as HTMLVideoElement).videoWidth
        : (image as HTMLImageElement).naturalWidth;
    let h =
      "videoHeight" in image
        ? (image as HTMLVideoElement).videoHeight
        : (image as HTMLImageElement).naturalHeight;
    let scale = canvas.width / w;
    let offsetY = (h * scale - canvas.height) / 2;
    frame.keypoints = frame.keypoints.map((kp) => ({
      ...kp,
      x: kp.x * scale,
      y: kp.y * scale - offsetY,
    }));
    var ctx = canvas.getContext("2d");
    ctx?.beginPath();

    frame.keypoints.forEach((kp) => {
      ctx?.moveTo(kp.x, kp.y);
      ctx?.arc(kp.x, kp.y, canvas.width * 0.01, 0, 2 * Math.PI, false);
    });
    ctx!.fillStyle = "white";
    ctx?.fill();
    ctx?.closePath();
  }
}
