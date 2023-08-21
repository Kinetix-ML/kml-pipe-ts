import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { CVImage, FMFrame, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";

// import * as faceMesh from "@mediapipe/face_mesh";

//@ts-ignore
import * as vision from "@mediapipe/tasks-vision";
import { imageDims } from "./utils.js";
//import "@tensorflow/tfjs-backend-wasm";

export default class FaceMeshDetection extends CVNodeProcess {
  detector?: vision.FaceLandmarker;

  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();

    const filesetResolver = await vision.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    this.detector = await vision.FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );
  }

  async execute() {
    let { w, h } = imageDims(
      this.vars[this.cvnode.inputs[0].connection!.id] as CVImage
    );
    let startMS = performance.now();
    let detectorOutput = this.detector?.detectForVideo(
      this.vars[this.cvnode.inputs[0].connection!.id] as CVImage,
      startMS
    );
    let outputs =
      detectorOutput.faceLandmarks && detectorOutput.faceLandmarks!.length > 0
        ? ({
            keypoints: detectorOutput.faceLandmarks[0],
          } as FMFrame)
        : DataType.NoDetections;

    if (outputs == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = outputs;
      return;
    }
    outputs.keypoints = outputs.keypoints.map((o) => ({
      x: o.x * w,
      y: o.y * h,
      z: o.z,
    }));
    this.vars[this.cvnode.outputs[0].id] = outputs;
    //console.log(this.vars[this.cvnode.outputs[0].id]);
  }
}
