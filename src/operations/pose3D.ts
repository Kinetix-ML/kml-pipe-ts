import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { CVImage, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
// @ts-ignore
import {
  FilesetResolver,
  PoseLandmarker,
  PoseLandmarkerResult,
  // @ts-ignore
} from "@mediapipe/tasks-vision";
//import "@tensorflow/tfjs-backend-wasm";

type Landmark = {
  x: number;
  y: number;
  z: number;
  visibility: number;
  presence: number;
};

export default class PoseDetector3D extends CVNodeProcess {
  confidenceThreshold: number = 0.3;
  detector?: PoseLandmarker.PoseDetector;
  runningMode = "IMAGE";

  async initialize() {
    await tf.setBackend("webgl");
    await tf.ready();
    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    this.confidenceThreshold = this.cvnode.parameters[0].value as number;
    this.detector = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: this.runningMode,
      minPoseDetectionConfidence: this.confidenceThreshold,
      numPoses: 1,
    });
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];
    if (input.videoWidth != undefined) {
      if (this.runningMode != "VIDEO")
        this.detector.setOptions({ runningMode: "VIDEO" });
      let detectorOutput = await this.detector?.detectForVideo(
        input as CVImage,
        performance.now()
      );
      this.vars[this.cvnode.outputs[0].id] = detectorOutput;
    } else {
      if (this.runningMode != "IMAGE")
        this.detector.setOptions({ runningMode: "IMAGE" });
      let detectorOutput = await this.detector?.detect(input as CVImage);
      this.vars[this.cvnode.outputs[0].id] = detectorOutput;
    }
  }

  landmarksToKeyPoints(
    image: HTMLVideoElement | HTMLImageElement,
    res: PoseLandmarkerResult
  ) {
    let w =
      "videoWidth" in image
        ? (image as HTMLVideoElement).videoWidth
        : (image as HTMLImageElement).naturalWidth;
    let h =
      "videoHeight" in image
        ? (image as HTMLVideoElement).videoHeight
        : (image as HTMLImageElement).naturalHeight;
    let frame: KPFrame = { keypoints: [], score: 1.0 };
    if (res.landmarks.length == 0) return DataType.NoDetections;
    res.landmarks[0].forEach((landmark: Landmark, i: number) => {
      frame.keypoints.push({
        x: landmark.x * w,
        y: landmark.y * h,
        z: landmark.z,
        score: landmark.presence,
        name: `${i}`,
      });
    });
    return frame;
  }
}
