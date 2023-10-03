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
import { Keypoint } from "@tensorflow-models/face-landmarks-detection";
//import "@tensorflow/tfjs-backend-wasm";

export default class PoseDetector3D extends CVNodeProcess {
  detector?: vision.PoseLandmarker;

  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();

    const filesetResolver = await vision.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    this.detector = await vision.PoseLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        //outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        //numFaces: 1,
      }
    );
  }

  async execute() {
    let { w, h } = (
      this.vars[this.cvnode.inputs[0].connection!.id] as CVImage
    ).getDims();
    let startMS = performance.now();
    let detectorOutput = this.detector?.detectForVideo(
      (this.vars[this.cvnode.inputs[0].connection!.id] as CVImage).getBest(),
      startMS
    );
    let outputs =
      detectorOutput.landmarks && detectorOutput.landmarks!.length > 0
        ? ({
            keypoints: detectorOutput.landmarks[0],
          } as FMFrame)
        : DataType.NoDetections;

    if (outputs == DataType.NoDetections) {
      this.vars[this.cvnode.outputs[0].id] = outputs;
      this.vars[this.cvnode.outputs[1].id] = outputs;
      return;
    }
    outputs.keypoints = outputs.keypoints.map((o) => ({
      x: o.x * w,
      y: o.y * h,
      z: o.z,
      score: 1.0,
    }));
    this.vars[this.cvnode.outputs[0].id] = outputs;
    this.vars[this.cvnode.outputs[1].id] = {
      ...outputs,
      keypoints: detectorOutput.worldLandmarks[0].map((kp: Keypoint) => ({
        ...kp,
        y: -kp.y,
        score: 1.0,
      })),
    };
    //console.log(this.vars[this.cvnode.outputs[0].id]);
  }
}
