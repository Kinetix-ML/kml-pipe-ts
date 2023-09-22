// @ts-ignore
import * as roboflow from "roboflow-js";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import { CVImage, Classification, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { tensorToBase64 } from "./utils.js";
//import "@tensorflow/tfjs-backend-wasm";

const url = "https://classify.roboflow.com/";

export default class RoboflowClassificationAPI extends CVNodeProcess {
  apiKey = "";
  embedURL = url;

  async initialize() {
    let model = this.cvnode.parameters[0].value as string;
    let version = this.cvnode.parameters[1].value as string;
    this.apiKey = this.cvnode.parameters[2].value as string;
    this.embedURL += `/${model}/${version}?api_key=${this.apiKey}`;
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];

    let images = Array.isArray(input) ? input : [input];

    let base64strPromises = images.map((im) => tensorToBase64(im));
    let base64strs = await Promise.all(base64strPromises);

    let classificationPromises = base64strs.map((im) => this.classifyImage(im));
    let classificationResults = await Promise.all(classificationPromises);

    this.vars[this.cvnode.outputs[0].id] = classificationResults;
  }

  async classifyImage(image: string) {
    let response = await fetch(this.embedURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: image,
    });
    let responseJSON = await response.json();
    return responseJSON as Classification;
  }
}
