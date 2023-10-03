import { Keypoint } from "@tensorflow-models/face-landmarks-detection";
import { CVNodeProcess } from "../base_structs/index.js";
import { KPFrame, Vec } from "../types/index.js";

export class RacketOrientation extends CVNodeProcess {
  async execute() {
    const handPose: KPFrame = this.vars[this.cvnode.inputs[0].connection!.id];

    if (handPose && handPose.keypoints && handPose.keypoints.length > 0) {
      const { normal, center } = this.calculateNormalVectorAndCenter(
        handPose.keypoints
      );
      this.vars[this.cvnode.outputs[0].id] = normal;
      this.vars[this.cvnode.outputs[1].id] = center;
    }
  }

  private calculateNormalVectorAndCenter(keypoints: Keypoint[]): {
    normal: Vec;
    center: Keypoint;
  } {
    // Assuming:
    // keypoints[2] = thumb base
    // keypoints[3] = thumb tip
    // keypoints[5] = index tip
    // Adjust these indices as per the model's output

    const thumbBase = keypoints[2];
    const thumbTip = keypoints[3];
    const indexTip = keypoints[5];
    const wrist = keypoints[0];

    const vectorA = {
      x: thumbTip.x - thumbBase.x,
      y: thumbTip.y - thumbBase.y,
      z: thumbTip.z! - thumbBase.z!,
    };

    const vectorB = {
      x: indexTip.x - thumbBase.x,
      y: indexTip.y - thumbBase.y,
      z: indexTip.z! - thumbBase.z!,
    };

    const normal = this.normalizeVector([
      vectorA.y * vectorB.z - vectorA.z * vectorB.y,
      vectorA.z * vectorB.x - vectorA.x * vectorB.z,
      vectorA.x * vectorB.y - vectorA.y * vectorB.x,
    ]);

    const center = {
      x: (thumbBase.x + thumbTip.x + indexTip.x) / 3 - wrist.x,
      y: -(thumbBase.y + thumbTip.y + indexTip.y) / 3 + wrist.y,
      z: (thumbBase.z! + thumbTip.z! + indexTip.z!) / 3 - wrist.z!,
    };

    return { normal, center };
  }

  private normalizeVector(v: Vec): Vec {
    const magnitude = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / magnitude, v[1] / magnitude, v[2] / magnitude];
  }
}
