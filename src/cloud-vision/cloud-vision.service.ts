import { Injectable } from "@nestjs/common";
import vision, { ImageAnnotatorClient } from "@google-cloud/vision";

@Injectable()
export class CloudVisionService {
  private vision: ImageAnnotatorClient;
  constructor() {
    this.vision = new vision.ImageAnnotatorClient();
  }

  async detectText(fileBuffer: Buffer): Promise<string> {
    try {
      const [result] = await this.vision.textDetection(fileBuffer);
      const detections = result.textAnnotations;
      const scannedTexts = detections[0].description.replace(/\n/g, "");
      return scannedTexts;
    } catch (error) {
      throw Error("Error in CloudVisionService");
    }
  }
}
