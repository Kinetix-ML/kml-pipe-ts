import { CVNode, CVNodeProcess } from "../base_structs";
import CalcJointAngles from "./calcJointAngles";
import PoseDetector2D from "./pose2D";
import SmoothKeyPoints from "./smoothKeyPoints";

export const NodeCatalog: { [operation: string]: any } = {
  PoseDetection2D: PoseDetector2D,
  CalcJointAngles: CalcJointAngles,
  SmoothKeyPoints: SmoothKeyPoints,
};

export const initProcess = (cvnode: CVNode, vars: { [id: string]: any }) => {
  let catalogItem = NodeCatalog[cvnode.operation];
  return new catalogItem(cvnode, vars);
};
