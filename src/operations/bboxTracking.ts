import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import {
  BBox,
  BBoxFrame,
  CVImage,
  Double,
  Int,
  KPFrame,
  Track,
} from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { calc3PtAngle } from "./utils.js";
// import '@tensorflow/tfjs-backend-wasm';

export default class BBoxTracking extends CVNodeProcess {
  tracks: Track[] = [];
  maxAge: number = 5;
  async initialize() {}

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];

    //this.vars[this.cvnode.outputs[0].id] = this.matchTracks(input);
  }

  private calculateIoU(boxA: BBox, boxB: BBox) {
    const xA = Math.max(boxA.bbox.x, boxB.bbox.x);
    const yA = Math.max(boxA.bbox.y, boxB.bbox.y);
    const xB = Math.min(
      boxA.bbox.x + boxA.bbox.width,
      boxB.bbox.x + boxB.bbox.width
    );
    const yB = Math.min(
      boxA.bbox.y + boxA.bbox.height,
      boxB.bbox.y + boxB.bbox.height
    );

    const intersectionArea =
      Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);
    const boxAArea = (boxA.bbox.width + 1) * (boxA.bbox.height + 1);
    const boxBArea = (boxB.bbox.width + 1) * (boxB.bbox.height + 1);

    return intersectionArea / (boxAArea + boxBArea - intersectionArea);
  }

  // private processFrame(newObjects: BBoxFrame, iouThreshold = 0.5) {
  //   const updatedTracks: Track[] = [];

  //   newObjects.forEach((object) => {
  //     let trackIOUs = this.tracks
  //       .map((track) => this.calculateIoU(track.bbox, object))

  //     if (bestTrack) {
  //       bestTrack.bbox = { ...object.bbox };
  //       bestTrack.age = 0;
  //       updatedTracks.push(bestTrack);
  //     } else {
  //       const newTrack = new Track(object.id, { ...object.bbox });
  //       updatedTracks.push(newTrack);
  //     }
  //   });

  //   tracks = updatedTracks;

  //   // Increment age for unmatched tracks
  //   tracks.forEach((track) => {
  //     if (!newObjects.some((object) => object.id === track.id)) {
  //       track.age++;
  //     }
  //   });
  // }
}
