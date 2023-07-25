import { CVNode, CVNodeProcess } from "../base_structs/index.js";
import AddInputs from "./addInputs.js";
import CalcJointAngles from "./calcJointAngles.js";
import CalcKeyPointVelocities from "./calcKeyPointVelocities.js";
import Constant from "./constant.js";
import CreateKeyPoint from "./createKeyPoint.js";
import DeconstructKeyPoint from "./deconstructKeyPoint.js";
import DivideInputs from "./divideInputs.js";
import DrawKeyPoints from "./drawKeyPoints.js";
import DrawLabels from "./drawLabels.js";
import GetKeyPoint from "./getKeyPoint.js";
import MultiplyInputs from "./multiplyInputs.js";
import PoseDetector2D from "./pose2D.js";
import SetKeyPoint from "./setkeyPoint.js";
import SmoothKeyPoints from "./smoothKeyPoints.js";
import SmoothVecs from "./smoothVecs.js";
import SubtractInputs from "./subtractInputs.js";

export const NodeCatalog: { [operation: string]: any } = {
  PoseDetection2D: PoseDetector2D,
  CalcJointAngles: CalcJointAngles,
  SmoothKeyPoints: SmoothKeyPoints,
  CalcKeyPointVelocities: CalcKeyPointVelocities,
  SmoothVecs: SmoothVecs,
  DrawKeyPoints: DrawKeyPoints,
  DrawLabels: DrawLabels,
  CreateKeyPoint: CreateKeyPoint,
  DeconstructKeyPoint: DeconstructKeyPoint,
  GetKeyPoint: GetKeyPoint,
  SetKeyPoint: SetKeyPoint,
  AddInputs: AddInputs,
  Constant: Constant,
  DivideInputs: DivideInputs,
  MultiplyInputs: MultiplyInputs,
  SubtractInputs: SubtractInputs,
};

export const initProcess = (cvnode: CVNode, vars: { [id: string]: any }) => {
  let catalogItem = NodeCatalog[cvnode.operation];
  return new catalogItem(cvnode, vars);
};
