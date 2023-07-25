import { Pose } from "@tensorflow-models/pose-detection";
import { Tensor3D } from "@tensorflow/tfjs-core";

export type CVImage = HTMLVideoElement | HTMLImageElement;
export type KPFrame = Pose;
export type Vec = number[];
export type Double = number;
export type Int = number;
export type String = string;
export type Canvas = HTMLCanvasElement;
export type Label = {
  x: number;
  y: number;
  value: string;
};
