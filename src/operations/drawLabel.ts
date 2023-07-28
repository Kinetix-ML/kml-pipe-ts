import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import {
  CVImage,
  Canvas,
  Double,
  Int,
  KPFrame,
  Label,
} from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class DrawLabel extends CVNodeProcess {
  async initialize() {}

  // 0 - Label[]
  // 1 - Image
  // 2 - Canvas
  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    let image = this.vars[this.cvnode.inputs[1].connection!.id] as CVImage;
    let canvas = this.vars[this.cvnode.inputs[2].connection!.id] as Canvas;
    if (input == DataType.NoDetections) {
      return;
    }
    console.log("Labels: " + JSON.stringify(input));
    this.drawLabel(input, image, canvas);
  }

  private drawLabel(label: Label, image: CVImage, canvas: Canvas) {
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
    let scaledLabel = {
      ...label,
      x: label.x * scale,
      y: label.y * scale - offsetY,
    };
    var ctx = canvas.getContext("2d");
    ctx?.beginPath();

    ctx?.moveTo(label.x, label.y);
    ctx?.arc(label.x, label.y, canvas.width * 0.03, 0, 2 * Math.PI, false);
    ctx!.fillStyle = "white";
    ctx?.fill();
    ctx?.closePath();
    ctx?.beginPath();

    ctx!.fillStyle = "black";
    ctx!.textAlign = "center";
    ctx?.moveTo(label.x, label.y);
    ctx?.fillText(label.value, label.x, label.y);
    ctx?.fill();
    ctx?.closePath();
  }
}
