import { Controller } from "@nestjs/common";
import { Configuration, OpenAIApi } from "openai";

@Controller()
export class GptController {
  constructor() {}
  static async generateText(prompt: string): Promise<any> {
    try {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
  
      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:prompt}],
        max_tokens: 500
      });

      const message = chatCompletion.data.choices[0].message.content
      return message
    } catch (error) {
      console.log(error);
      throw new Error('Failed to connect to GPT.');
    }
  }
}
