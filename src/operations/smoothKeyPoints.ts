import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-node-gpu";
import { CVImage, Double, Int, KPFrame } from "../types";
import { CVNode, CVNodeProcess, CVVariable, DataType } from "../base_structs";
import { calc3PtAngle } from "./utils";
// import '@tensorflow/tfjs-backend-wasm';

export default class SmoothKeyPoints extends CVNodeProcess {
  frameCount: Int = 10;
  buffer: KPFrame[] = [];
  async initialize() {
    this.frameCount = this.vars[this.cvnode.parameters[0].id] as Int;
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = DataType.NoDetections;
      return;
    }
    this.buffer.push(input);
    if (this.buffer.length > this.frameCount) this.buffer.slice(0, 1);
    this.vars[this.cvnode.outputs[0].id] = this.averageFrames();
  }

  private averageFrames(): KPFrame {
    let res = Object.assign(this.buffer[0]);
    for (let i = 0; i < this.buffer[0].keypoints.length; i++) {
      // find sum of scores for denominator of weighted average
      let sumScores = this.buffer.reduce(
        (acc, cur) => acc + (cur.keypoints[i].score as number),
        0
      );

      // calculate new x value using weighted average of all of the x coordinates
      let newX = this.buffer.reduce(
        (acc, cur) =>
          acc +
          cur.keypoints[i].x * ((cur.keypoints[i].score as number) / sumScores),
        0
      );

      // calculate new y value using weighted average of all of the y coordinates
      let newY = this.buffer.reduce(
        (acc, cur) =>
          acc +
          cur.keypoints[i].y * ((cur.keypoints[i].score as number) / sumScores),
        0
      );

      // calculate new score value using average of all of the scores coordinates
      let newScore =
        this.buffer.reduce(
          (acc, cur) => acc + (cur.keypoints[i].score as number),
          0
        ) / this.buffer.length;

      // returning new keypoint
      res.keypoints[i] = {
        x: newX,
        y: newY,
        score: newScore,
        name: res.keypoints[i].name,
      };
    }

    // average overall score
    res.score =
      this.buffer.reduce((acc, cur) => acc + (cur.score as number), 0) /
      this.buffer.length;

    return res as KPFrame;
  }
}
