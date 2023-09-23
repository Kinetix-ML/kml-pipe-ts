import { Face } from "@tensorflow-models/face-landmarks-detection";
import { Pose } from "@tensorflow-models/pose-detection";
import { Tensor, Tensor3D } from "@tensorflow/tfjs-core";
import * as tf from "@tensorflow/tfjs-core";
import { tensorToBase64 } from "../operations/utils.js";

//export type CVImage = HTMLVideoElement | HTMLImageElement;
export class CVImage {
  data: { [dtype: string]: any } = {};

  constructor(image: HTMLVideoElement | HTMLImageElement | Tensor | CVImage) {
    if (image instanceof CVImage) {
      this.data = image.data;
    } else if (
      image instanceof HTMLVideoElement ||
      image instanceof HTMLImageElement
    ) {
      this.data.html = image;
    } else if (image instanceof Tensor) {
      this.data.tensor = image;
    }
  }

  getTensor3D(): Tensor3D {
    if (this.data.tensor) return this.data.tensor;

    let tensorData = tf.browser.fromPixels(this.data.html);
    this.data.tensor = tensorData;
    return this.data.tensor;
  }

  getTensor4D(): tf.Tensor4D {
    if (this.data.tensor) return tf.expandDims(this.data.tensor);

    this.getTensor3D();
    return tf.expandDims(this.data.tensor);
  }

  getHTML(): HTMLImageElement | HTMLVideoElement {
    if (this.data.html) return this.data.html;

    let canvas = document.createElement("canvas");
    let tensorData = tf.browser.toPixels(this.data.tensor, canvas);
    let dataURL = canvas.toDataURL();
    let image = document.createElement("img");
    image.src = dataURL;
    this.data.html = image;
    return this.data.html;
  }

  getBest(): HTMLImageElement | HTMLVideoElement | Tensor {
    if (this.data.tensor) return this.data.tensor;
    return this.data.html;
  }

  getDims(): { w: number; h: number } {
    if (this.data.tensor) {
      let w = this.data.tensor.shape[0];
      let h = this.data.tensor.shape[1];
      return { w, h };
    }
    let img = this.getHTML();
    let w =
      "videoWidth" in img
        ? (img as HTMLVideoElement).videoWidth
        : (img as HTMLImageElement).naturalWidth;
    let h =
      "videoHeight" in img
        ? (img as HTMLVideoElement).videoHeight
        : (img as HTMLImageElement).naturalHeight;
    return { w, h };
  }

  async getBase64(): Promise<string> {
    let base64str = await tensorToBase64(this.getTensor3D());
    return base64str;
  }
}
export type KPFrame = Pose;
export type BBoxFrame = BBox[];
export type BBox = {
  class: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  color: string;
};
export type Classification = {
  predictions: { class: string; confidence: Double }[];
};
export type FMFrame = Face;
export type Vec = number[];
export type Double = number;
export type Int = number;
export type String = string;
export type Canvas = HTMLCanvasElement;
export type Label = {
  x: number;
  y: number;
  value: string;
};
export type Track = { id: number; bbox: BBox; age: number };
