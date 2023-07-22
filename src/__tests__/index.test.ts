import { KMLPipeline } from "..";
import { exp, node } from "@tensorflow/tfjs-node-gpu";
import { promises as fs } from "fs";
import { CVImage } from "../types";
import { CVVariable, DataType } from "../base_structs";
import "cross-fetch/polyfill";

test("Create and Load Pipeline from FB", async () => {
  const pipeline = new KMLPipeline(
    "Test Smooth",
    1,
    "79705c77-f57b-449d-b856-03138e8859a7"
  );
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

let pipeline: KMLPipeline;
test("Create Pipeline from FB", async () => {
  pipeline = new KMLPipeline(
    "Test Smooth",
    1,
    "79705c77-f57b-449d-b856-03138e8859a7"
  );
});

test("Load Pipeline from FB", async () => {
  await pipeline.initialize();
});

test("Execute Pipeline from FB", async () => {
  const imageBuffer = await fs.readFile("src/operations/__tests__/test1.jpeg");
  const inputTensor = node.decodeImage(imageBuffer);
  for (let i = 0; i < 20; i++) {
    let t0 = Date.now();
    let results = await pipeline.execute([inputTensor as CVImage]);
    let t = Date.now() - t0;
    console.log(
      "Pipeline Execution took " + t + "ms " + 1 / (t / 1000) + "fps"
    );
    console.log(JSON.stringify(results.map((res) => res.value)));
    expect(results[0]).toHaveProperty("value");
  }
});
