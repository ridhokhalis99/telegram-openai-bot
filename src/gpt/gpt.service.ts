import { Injectable } from "@nestjs/common";
import { Configuration, OpenAIApi } from "openai";

@Injectable()
export class GptService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const chatCompletion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });

      const message = chatCompletion.data.choices[0].message.content;
      return message;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to connect to GPT.");
    }
  }
}
