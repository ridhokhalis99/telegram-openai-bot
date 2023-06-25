import { Controller, Post, Body } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import {
  TelegramWebhookPayload,
  WebhookResultDto,
} from "./dto/webhook-telegram-bot";
import { GptService } from "src/gpt/gpt.service";
import { MongodbService } from "src/mongodb/mongodb.service";
import { ImageGeneratorService } from "src/image-generator/image-generator.service";
import { TelegramService } from "src/telegram/telegram.service";
import { CloudVisionService } from "src/cloud-vision/cloud-vision.service";
import { AudioProcessingService } from "src/audio-processing/audio-processing.service";

@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly gptService: GptService,
    private readonly mongodbService: MongodbService,
    private readonly imageGeneratorService: ImageGeneratorService,
    private readonly cloudVisionService: CloudVisionService,
    private readonly telegramService: TelegramService,
    private readonly audioProcessingService: AudioProcessingService
  ) {}

  private async handleStartCommand(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    const prompt = telegramWebhookPayload?.message?.text;
    const message = await this.gptService.generateText(prompt);
    await this.mongodbService.saveChat(telegramWebhookPayload, message);
    return message;
  }

  private handleHelpCommand(): string {
    const messages = [
      "/start - Start a new session",
      "/help - Show this help message",
      "/imagine - Generate an image based on your prompt",
      "/imagine_variation - Generate an image based on the last generated image",
      "/scan - Scan an image and generate text based on the image",
      "/end - End the current session",
    ];
    return messages.join("\n");
  }

  private async handleImagineCommand(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    const prompt = telegramWebhookPayload?.message?.text;
    const imageUrl = await this.imageGeneratorService.generateByPrompt(prompt);
    await this.mongodbService.saveImage(telegramWebhookPayload, imageUrl);
    return imageUrl;
  }

  private async handleImagineVariationCommand(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    const originalImageUrl = await this.mongodbService.getImage(
      telegramWebhookPayload
    );
    if (!originalImageUrl) {
      return "No image found, send /imagine to generate one.";
    }
    const imageUrl = await this.imageGeneratorService.generateVariation(
      originalImageUrl
    );
    return imageUrl;
  }

  private async handleScanCommand(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    const photo = telegramWebhookPayload?.message?.photo;
    const caption = telegramWebhookPayload?.message?.caption;
    if (!photo) return null;
    const imageFile = await this.telegramService.getImageFile(
      photo[photo.length - 1].file_id
    );
    const scannedTexts = await this.cloudVisionService.detectText(imageFile);
    const message = await this.gptService.generateTextByImage(
      caption,
      scannedTexts
    );
    await this.mongodbService.saveChat(telegramWebhookPayload, message);
    return message;
  }

  private async handleTranscribeCommand(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    const voice = telegramWebhookPayload?.message?.voice;
    if (!voice) return null;
    const chat = await this.mongodbService.getChat(telegramWebhookPayload);
    const voiceBuffer = await this.telegramService.getVoiceFile(voice.file_id);
    await this.audioProcessingService.convertOgaToMp3(
      voiceBuffer,
      telegramWebhookPayload
    );
    const transcribedText = await this.audioProcessingService.transcribeAudio(
      telegramWebhookPayload
    );
    await this.audioProcessingService.removeAudioFiles(telegramWebhookPayload);
    const message = await this.gptService.generateText(transcribedText, chat);
    await this.mongodbService.saveChat(
      telegramWebhookPayload,
      message,
      transcribedText
    );
    return message;
  }

  private async handleEndCommand(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    await this.mongodbService.removeChat(telegramWebhookPayload);
    return "Goodbye!, send /start to start a new session.";
  }

  private async handleDefaultCommand(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    const prompt = telegramWebhookPayload?.message?.text;
    const chat = await this.mongodbService.getChat(telegramWebhookPayload);
    const message = await this.gptService.generateText(prompt, chat);
    await this.mongodbService.saveChat(telegramWebhookPayload, message);
    return message;
  }

  @Post("/")
  async postWebhook(
    @Body() telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<void> {
    let command: string;
    const prompt = telegramWebhookPayload?.message?.text;
    const caption = telegramWebhookPayload?.message?.caption;
    const voice = telegramWebhookPayload?.message?.voice;

    if (voice) command = "/transcribe";
    else command = prompt?.split(" ")[0] || caption?.split(" ")[0];

    console.log("Command: ", command);

    let message: string;
    let imageUrl: string;
    try {
      switch (command) {
        case "/start":
          message = await this.handleStartCommand(telegramWebhookPayload);
          break;
        case "/help":
          message = this.handleHelpCommand();
          break;
        case "/imagine":
          imageUrl = await this.handleImagineCommand(telegramWebhookPayload);
          break;
        case "/imagine_variation":
          imageUrl = await this.handleImagineVariationCommand(
            telegramWebhookPayload
          );
          break;
        case "/scan":
          message = await this.handleScanCommand(telegramWebhookPayload);
          break;
        case "/transcribe":
          message = await this.handleTranscribeCommand(telegramWebhookPayload);
          break;
        case "/end":
          message = await this.handleEndCommand(telegramWebhookPayload);
          break;
        default:
          message = await this.handleDefaultCommand(telegramWebhookPayload);
          break;
      }

      const result: WebhookResultDto = {
        chatId: telegramWebhookPayload.message.chat.id,
        message,
        imageUrl,
      };

      await this.webhookService.postWebhook(result);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}
