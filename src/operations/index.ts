import { CVNode, CVNodeProcess } from "../base_structs/index.js";
import CalcJointAngles from "./calcJointAngles.js";
import CalcKeyPointVelocities from "./calcKeyPointVelocities.js";
import DrawKeyPoints from "./drawKeyPoints.js";
import DrawLabels from "./drawLabels.js";
import PoseDetector2D from "./pose2D.js";
import SmoothKeyPoints from "./smoothKeyPoints.js";
import SmoothVecs from "./smoothVecs.js";

export const NodeCatalog: { [operation: string]: any } = {
  PoseDetection2D: PoseDetector2D,
  CalcJointAngles: CalcJointAngles,
  SmoothKeyPoints: SmoothKeyPoints,
  CalcKeyPointVelocities: CalcKeyPointVelocities,
  SmoothVecs: SmoothVecs,
  DrawKeyPoints: DrawKeyPoints,
  DrawLabels: DrawLabels,
};

export const initProcess = (cvnode: CVNode, vars: { [id: string]: any }) => {
  let catalogItem = NodeCatalog[cvnode.operation];
  return new catalogItem(cvnode, vars);
};
