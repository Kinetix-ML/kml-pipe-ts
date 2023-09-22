// @ts-ignore
import * as roboflow from "roboflow-js";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import { CVImage, KPFrame } from "../types/index.js";
import {
  CVNode,
  CVNodeProcess,
  CVVariable,
  DataType,
} from "../base_structs/index.js";
import { tensorToBase64 } from "./utils.js";
//import "@tensorflow/tfjs-backend-wasm";

const url = "https://infer.roboflow.com";

export default class RoboflowEmbedText extends CVNodeProcess {
  apiKey = "";
  embedURL = url;

  async initialize() {
    this.apiKey = this.cvnode.parameters[0].value as string;
    this.embedURL += `/clip/embed_text?api_key=${this.apiKey}`;
  }

  async execute() {
    let input = this.vars[this.cvnode.inputs[0].connection!.id];

    let text = Array.isArray(input) ? input : [input];

    let payload = JSON.stringify({ text });
    console.log(payload);

    let response = await fetch(this.embedURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload,
    });
    let responseJSON = await response.json();
    this.vars[this.cvnode.outputs[0].id] = responseJSON.embeddings;
  }
}
