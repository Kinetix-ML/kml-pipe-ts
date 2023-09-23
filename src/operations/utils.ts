import { Keypoint } from "@tensorflow-models/pose-detection";
import { BBox, Int, Vec } from "../types/index.js";
import { Tensor } from "@tensorflow/tfjs-core";
import * as tf from "@tensorflow/tfjs-core";

export const calc3PtAngle = (pt1: Keypoint, pt2: Keypoint, pt3: Keypoint) => {
  let u: [number, number] = [pt1.x - pt2.x, pt1.y - pt2.y];
  let v: [number, number] = [pt3.x - pt2.x, pt3.y - pt2.y];
  return toDeg(Math.acos((u[0] * v[0] + u[1] * v[1]) / (vm(u) * vm(v))));
};

export const vm = (v: [number, number]) => {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2);
};

export const toDeg = (rads: number) => {
  var pi = Math.PI;
  return rads * (180 / pi);
};

export const vectorLength = (vals: number[]) => {
  let sum = vals.reduce((acc, cur) => cur + acc ** 2);
  return Math.sqrt(sum);
};

export const kptDist = (kpt1: Keypoint, kpt2: Keypoint) => {
  return vectorLength([kpt2.x - kpt1.x, kpt2.y - kpt1.y]);
};

export const bboxesToCrops = (boxes: BBox[]) =>
  boxes.map((bbox) => {
    let y1 = bbox.bbox.y - bbox.bbox.height / 2;
    let x1 = bbox.bbox.x - bbox.bbox.width / 2;
    let y2 = bbox.bbox.y + bbox.bbox.height / 2;
    let x2 = bbox.bbox.x + bbox.bbox.width / 2;
    return [y1, x1, y2, x2];
  });

export const normCrops = (w: Int, h: Int, crops: Vec[]) =>
  crops.map((crop) => [crop[0] / h, crop[1] / w, crop[2] / h, crop[3] / w]);

export const tensorToBase64 = async (tensor: tf.Tensor3D) => {
  const canvas = document.createElement("canvas");
  canvas.width = tensor.shape[1] as number;
  canvas.height = tensor.shape[0] as number;
  await tf.browser.toPixels(tensor, canvas);
  return canvas.toDataURL();
};
