import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Double, Int, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class CropKeyPoints extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    let min = this.findMin(input);
    let max = this.findMax(input);
    let frameSize = max - min;
    let x = input.keypoints[0].x - frameSize / 2;
    let y = min;

    this.vars[this.cvnode.outputs[0].id] = this.scaleCoords(
      input,
      x,
      y,
      frameSize
    );
  }

  private findMax(frame: KPFrame): number {
    let vals = frame.keypoints.sort((a, b) => b.y - a.y);
    return vals[0].y;
  }

  private findMin(frame: KPFrame): number {
    let vals = frame.keypoints.sort((a, b) => a.y - b.y);
    return vals[0].y;
  }

  private scaleCoords(
    frame: KPFrame,
    x: number,
    y: number,
    size: number
  ): KPFrame {
    let newKeypoints = frame.keypoints.map((kp) => ({
      ...kp,
      x: (kp.x - x) / size,
      y: (kp.y - y) / size,
    }));
    let newFrame = { ...frame, keypoints: newKeypoints };
    return newFrame;
  }
}
