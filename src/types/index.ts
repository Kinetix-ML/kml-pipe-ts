import { Face } from "@tensorflow-models/face-landmarks-detection";
import { Pose } from "@tensorflow-models/pose-detection";
import { Tensor3D } from "@tensorflow/tfjs-core";

export type CVImage = HTMLVideoElement | HTMLImageElement;
export type KPFrame = Pose;
export type BBoxFrame = BBox[];
export type BBox = {
  class: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  color: string;
};
export type Classification = {
  predictions: { class: string; confidence: Double }[];
};
export type FMFrame = Face;
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
export type Track = { id: number; bbox: BBox; age: number };
