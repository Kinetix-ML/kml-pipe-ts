import { KMLPipeline } from "..";
import { exp, node } from "@tensorflow/tfjs-node-gpu";
import { promises as fs } from "fs";
import { CVImage } from "../types";
import { CVVariable, DataType } from "../base_structs";

test("Create and Load Pipeline from FB", async () => {
  const pipeline = new KMLPipeline("Test Project", 1);
  await pipeline.initialize();
});

test("Test CVVariable", () => {
  let newVariable: CVVariable = {
    id: "testVar",
    name: "testVar",
    dataType: DataType.Vec,
  };
  expect(newVariable).toHaveProperty("id");
  newVariable.value = [1, 2, 3];
  expect(newVariable).toHaveProperty("value");
});

test("Create, Load, and Execute Pipeline from FB", async () => {
  const pipeline = new KMLPipeline("Test Project", 1);
  await pipeline.initialize();
  const imageBuffer = await fs.readFile("src/operations/__tests__/test1.jpeg");
  const inputTensor = node.decodeImage(imageBuffer);
  let t0 = Date.now();
  let results = await pipeline.execute([inputTensor as CVImage]);
  let t = Date.now() - t0;
  console.log("Pipeline Execution took " + t + "ms " + 1 / (t / 1000) + "fps");
  console.log(results);
  expect(results[0]).toHaveProperty("value");
});
