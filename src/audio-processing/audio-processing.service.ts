import { Injectable } from "@nestjs/common";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
import * as Ffmpeg from "fluent-ffmpeg";
import { TelegramWebhookPayload } from "src/webhook/dto/webhook-telegram-bot";

@Injectable()
export class AudioProcessingService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async convertOgaToMp3(
    voice: Buffer,
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<void> {
    const fileInput = `./tmp/input_${telegramWebhookPayload.message.voice.file_id}.oga`;
    const fileOutput = `./tmp/output_${telegramWebhookPayload.message.voice.file_id}.mp3`;
    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(fileInput, voice);
        Ffmpeg(fileInput)
          .output(fileOutput)
          .on("end", function () {
            resolve();
          })
          .on("error", function (err) {
            console.log("An error occurred: " + err.message);
            reject(err);
          })
          .run();
      } catch (error) {
        console.log("Error: ", error);
        reject(error);
      }
    });
  }

  async transcribeAudio(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    const fileInput = `./tmp/output_${telegramWebhookPayload.message.voice.file_id}.mp3`;
    try {
      const transcribeResult = await this.openai.createTranscription(
        fs.createReadStream(fileInput) as any,
        "whisper-1"
      );
      return transcribeResult?.data?.text;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async removeAudioFiles(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<void> {
    try {
      const fileInput = `./tmp/input_${telegramWebhookPayload.message.voice.file_id}.oga`;
      const fileOutput = `./tmp/output_${telegramWebhookPayload.message.voice.file_id}.mp3`;
      fs.unlinkSync(fileInput);
      fs.unlinkSync(fileOutput);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}
