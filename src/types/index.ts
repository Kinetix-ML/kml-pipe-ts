import { Pose } from "@tensorflow-models/pose-detection";
import { Tensor3D } from "@tensorflow/tfjs-core";

export type CVImage =
  | Tensor3D
  | ImageData
  | HTMLVideoElement
  | HTMLImageElement
  | HTMLCanvasElement
  | ImageBitmap;
export type KPFrame = Pose;
export type Vec = number[];
export type Double = number;
export type Int = number;
export type String = string;
