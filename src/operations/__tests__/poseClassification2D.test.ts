import { node } from "@tensorflow/tfjs-node-gpu";
import {
  CVNode,
  CVPipeline,
  CVVariable,
  CVVariableConnection,
  DataType,
  Platform,
} from "../../base_structs";
import PoseDetector2D from "../pose2D";
import { promises as fs } from "fs";
import { CVImage } from "../../types";
import PoseClassification2D from "../poseClassification2D";
import "cross-fetch/polyfill";

var inputVar: CVVariable = {
  id: "input-0-var",
  name: "Input KPFrame",
  dataType: DataType.KPFrame,
};
var input: CVVariableConnection = {
  id: "input-0",
  connection: inputVar,
  dataType: DataType.KPFrame,
};
var output: CVVariable = {
  id: "output-0",
  name: "KPFrame Output",
  dataType: DataType.String,
};

var cvnode2: CVNode = {
  label: "Pose Classification 2D",
  operation: "PoseClassification2D",
  parameters: [
    {
      id: "Model Weights",
      name: "modelWeights",
      dataType: DataType.String,
      value:
        "https://firebasestorage.googleapis.com/v0/b/kml-platform.appspot.com/o/c5htBpzBRmdVi494OS85%2Fpose_classifier.tflite?alt=media&token=4ecd24f9-080d-4bbb-9e96-f4b694da764f",
    },
    {
      id: "Pose Labels",
      name: "poseLabels",
      dataType: DataType.String,
      value:
        "https://firebasestorage.googleapis.com/v0/b/kml-platform.appspot.com/o/c5htBpzBRmdVi494OS85%2Fpose_labels.txt?alt=media&token=23876989-ce87-4f0a-98b9-d527361f1e8b",
    },
  ],
  inputs: [input],
  outputs: [output],
  supportedPlatforms: [Platform.JS],
};
var vars: { [id: string]: any } = {
  "Model Weights":
    "https://storage.cloud.google.com/kml-platform.appspot.com/c5htBpzBRmdVi494OS85/pose_classifier.tflite?authuser=0",
};
var params: { [id: string]: any } = {};
var poseClassification2D = new PoseClassification2D(cvnode2, vars, params);

test("PoseDetector2D and PoseClassification2D Initializes", async () => {
  await poseClassification2D.initialize();
  expect(poseClassification2D.classifier).not.toBe(undefined);
});
