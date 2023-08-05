import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { CVImage, FMFrame, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";

import * as faceMesh from "@mediapipe/face_mesh";
//import "@tensorflow/tfjs-backend-wasm";

export default class FaceMeshDetection extends CVNodeProcess {
  detector?: faceLandmarksDetection.FaceLandmarksDetector;

  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig =
      {
        refineLandmarks: false,
        runtime: "mediapipe",
        maxFaces: 1,
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
      };
    this.detector = await faceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
  }

  async execute() {
    let detectorOutput = await this.detector
      ?.estimateFaces(
        this.vars[this.cvnode.inputs[0].connection!.id] as CVImage
      )
      .catch((err) => console.warn(err));
    // console.log(detectorOutput);
    this.vars[this.cvnode.outputs[0].id] =
      detectorOutput && detectorOutput!.length > 0
        ? (detectorOutput![0] as FMFrame)
        : DataType.NoDetections;
  }
}
