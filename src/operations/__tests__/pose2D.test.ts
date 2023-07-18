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

var inputVar: CVVariable = {
  id: "input-0-var",
  name: "Input Image",
  dataType: DataType.CVImage,
};
var input: CVVariableConnection = {
  id: "input-0",
  connection: inputVar,
  dataType: DataType.CVImage,
};
var output: CVVariable = {
  id: "output-0",
  name: "KPFrame Output",
  dataType: DataType.KPFrame,
};
var cvnode: CVNode = {
  label: "Pose Detector 2D",
  operation: "PoseDetector2D",
  parameters: [
    {
      id: "confidenceThreshold",
      name: "confidenceThreshold",
      dataType: DataType.Double,
      value: 0.3,
    },
  ],
  inputs: [input],
  outputs: [output],
  supportedPlatforms: [Platform.JS],
};
var poseDetector2D = new PoseDetector2D(cvnode);

test("PoseDetector2D Initializes", async () => {
  await poseDetector2D.initialize();
  expect(poseDetector2D.detector).not.toBe(undefined);
});

test("PoseDetector2D Executes", async () => {
  const imageBuffer = await fs.readFile("src/operations/__tests__/test1.jpeg");
  const inputTensor = node.decodeImage(imageBuffer);
  input.connection!.value = inputTensor;
  await poseDetector2D.execute();
  expect(output.value).toHaveLength(1);
});
