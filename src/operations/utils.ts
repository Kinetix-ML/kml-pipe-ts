import { Keypoint } from "@tensorflow-models/pose-detection";

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
