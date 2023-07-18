import { CVNode, CVNodeProcess } from "../base_structs";
import CalcJointAngles from "./calcJointAngles";
import PoseDetector2D from "./pose2D";

export const NodeCatalog: { [operation: string]: any } = {
  PoseDetection2D: PoseDetector2D,
  CalcJointAngles: CalcJointAngles,
};

export const initProcess = (cvnode: CVNode) => {
  let catalogItem = NodeCatalog[cvnode.operation];
  return new catalogItem(cvnode);
};
