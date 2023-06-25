import { Injectable } from "@nestjs/common";
import { Configuration, OpenAIApi } from "openai";

@Injectable()
export class AudioProcessingService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async transcribe(voice: any): Promise<string> {
    try {
      const response = await this.openai.createTranscription(
        voice as unknown as File,
        "whisper-1"
      );
      return "test";
    } catch (error) {
      throw new Error("Failed to connect to GPT.");
    }
  }
}
