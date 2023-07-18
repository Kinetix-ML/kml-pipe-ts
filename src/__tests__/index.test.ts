import { KMLPipeline } from "..";

test("Create and Load Pipeline from FB", async () => {
  const pipeline = new KMLPipeline("Test Project", 1);
  await pipeline.initialize();
});
