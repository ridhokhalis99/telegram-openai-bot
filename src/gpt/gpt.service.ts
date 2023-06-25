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

  async generateText(prompt: string, chat?: any): Promise<string> {
    try {
      const oldMessages = chat?.messages || [];
      const messages = [...oldMessages, { role: "user", content: prompt }];
      const chatCompletion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 500,
        messages,
      });
      const choices = chatCompletion.data.choices;
      const message = choices[choices.length - 1].message.content;
      return message;
    } catch (error) {
      console.log(error.message, "Failed to connect to GPT.");
    }
  }

  async generateTextByImage(
    prompt: string,
    scannedTexts: string
  ): Promise<string> {
    try {
      const promptWithoutCommand = prompt?.split(" ")?.slice(1)?.join(" ");
      const newMessage = promptWithoutCommand + "\n" + scannedTexts;
      const imageCompletion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 500,
        messages: [{ role: "user", content: newMessage }],
      });
      const choices = imageCompletion.data.choices;
      const message = choices[choices.length - 1].message.content;
      return message;
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}
