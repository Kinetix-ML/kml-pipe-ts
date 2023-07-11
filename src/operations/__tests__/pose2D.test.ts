import { node } from "@tensorflow/tfjs-node-gpu";
import { CVVariable } from "../../base_structs";
import PoseDetector2D from "../pose2D";
import {promises as fs} from "fs"

var input = new CVVariable("image")
var output = new CVVariable("pose")
var poseDetector2D = new PoseDetector2D("Pose Detector", "PoseDetector2D", [input], [output])
    
test("PoseDetector2D Initializes", async () => {
    await poseDetector2D.initialize()
    expect(poseDetector2D.detector).not.toBe(undefined)
})

test("PoseDetector2D Executes", async () => {
    const imageBuffer = await fs.readFile("src/operations/__tests__/test1.jpeg");
    const inputTensor = node.decodeImage(imageBuffer)
    input.value = inputTensor
    await poseDetector2D.execute()
    expect(output.value).toHaveLength(1)
})