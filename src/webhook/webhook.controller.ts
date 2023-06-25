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

@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly gptService: GptService,
    private readonly mongodbService: MongodbService,
    private readonly imageGeneratorService: ImageGeneratorService,
    private readonly cloudVisionService: CloudVisionService,
    private readonly telegramService: TelegramService
  ) {}

  @Post("/")
  async postWebhook(
    @Body() telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<void> {
    try {
      const prompt = telegramWebhookPayload?.message?.text;
      const caption = telegramWebhookPayload?.message?.caption;
      const command = prompt?.split(" ")[0] || caption.split(" ")[0];
      const photo = telegramWebhookPayload?.message?.photo;
      let message: string;
      let imageUrl: string;

      switch (command) {
        case "/start":
          message = await this.gptService.generateText(prompt);
          this.mongodbService.saveChat(telegramWebhookPayload, message);
          break;
        case "/help":
          message = `
            /start - Start a new session
            /help - Show this help message
            /imagine - Generate an image based on your prompt
            /imagine_variation - Generate an image based on the last generated image
            /scan - Scan an image and generate text based on the image
            /end - End the current session
          `
        break
        case "/imagine":
          imageUrl = await this.imageGeneratorService.generateByPrompt(prompt);
          this.mongodbService.saveImage(telegramWebhookPayload, imageUrl);
          break;
        case "/imagine_variation":
          const originalImageUrl = await this.mongodbService.getImage(
            telegramWebhookPayload
          );
          if (!originalImageUrl) {
            message = "No image found, send /imagine to generate one.";
            break;
          }
          imageUrl = await this.imageGeneratorService.generateVariation(
            originalImageUrl
          );
          break;
        case "/scan":
          if (!photo) break;
          const imageFile = await this.telegramService.getImageFile(
            photo[photo.length - 1].file_id
          );
          const scannedTexts = await this.cloudVisionService.detectText(
            imageFile
          );
          message = await this.gptService.generateTextByImage(
            caption,
            scannedTexts
          );
          this.mongodbService.saveChat(telegramWebhookPayload, message);
          break;
        case "/end":
          message = "Goodbye!, send /start to start a new session.";
          this.mongodbService.removeChat(telegramWebhookPayload);
          break;
        default:
          const chat = await this.mongodbService.getChat(
            telegramWebhookPayload
          );
          message = await this.gptService.generateText(prompt, chat);
          this.mongodbService.saveChat(telegramWebhookPayload, message);
          break;
      }

      const result: WebhookResultDto = {
        chatId: telegramWebhookPayload.message.chat.id,
        message,
        imageUrl,
      };

      await this.webhookService.postWebhook(result);
    } catch (error) {
      throw Error("Error in WebhookController");
    }
  }
}
