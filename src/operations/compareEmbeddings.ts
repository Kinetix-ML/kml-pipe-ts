import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, Double, Int, KPFrame, Vec } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class CompareEmbeddings extends CVNodeProcess {
  async initialize() {}

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    let input2 = this.vars[this.cvnode.inputs[1].connection!.id];

    this.vars[this.cvnode.outputs[0].id] = this.compareEmbeddings(
      input,
      input2
    );
  }

  private compareEmbeddings(e1: Vec[], e2: Vec[]): Vec[] {
    let res: Vec[] = [];
    for (let x = 0; x < e1.length; x++) {
      let row: Vec = [];
      for (let y = 0; y < e2.length; y++) {
        row.push(this.cosineSimilarity(e1[x], e2[y]));
      }
      res.push(row);
    }
    return res;
  }

  private cosineSimilarity(vector1: number[], vector2: number[]) {
    if (vector1.length !== vector2.length) {
      throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normVector1 = 0;
    let normVector2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      normVector1 += vector1[i] * vector1[i];
      normVector2 += vector2[i] * vector2[i];
    }

    normVector1 = Math.sqrt(normVector1);
    normVector2 = Math.sqrt(normVector2);

    if (normVector1 === 0 || normVector2 === 0) {
      return 0; // Handle zero vector case
    }

    const similarity = dotProduct / (normVector1 * normVector2);
    return similarity;
  }
}
