import { Injectable } from "@nestjs/common";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import fs from "fs";

@Injectable()
export class ImageGeneratorService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateByPrompt(prompt: string) {
    try {
      const promptWithoutCommand = prompt.split(" ").slice(1).join(" ");
      const response = await this.openai.createImage({
        prompt: promptWithoutCommand,
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = response.data.data[0].url;
      return imageUrl;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to connect to GPT.");
    }
  }

  async generateVariation(originalImageUrl: string) {
    try {
      const response = await axios.get(originalImageUrl, {
        responseType: "stream",
      });
      const imageStream = response.data;
      const variationResponse = await this.openai.createImageVariation(
        imageStream as File,
        1,
        "1024x1024"
      );
      const imageUrl = variationResponse.data.data[0].url;
      return imageUrl;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to connect to GPT.");
    }
  }
}
