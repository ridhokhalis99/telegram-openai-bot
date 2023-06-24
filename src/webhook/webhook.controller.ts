import { Controller, Post, Body } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import {
  TelegramWebhookPayload,
  WebhookResultDto,
} from "./dto/webhook-telegram-bot";
import { GptService } from "src/gpt/gpt.service";
import { MongodbService } from "src/mongodb/mongodb.service";
import { ImageGeneratorService } from "src/image-generator/image-generator.service";

@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly gptService: GptService,
    private readonly mongodbService: MongodbService,
    private readonly ImageGeneratorService: ImageGeneratorService
  ) {}

  @Post("/")
  async postWebhook(
    @Body() telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<void> {
    const prompt = telegramWebhookPayload?.message?.text;
    const command = prompt?.split(" ")[0];
    let message: string;
    let image: string;

    switch (command) {
      case "/start":
        message = await this.gptService.generateText(prompt);
        this.mongodbService.saveChat(telegramWebhookPayload, message);
        break;
      case "/imagine":
        image = await this.ImageGeneratorService.generateByPrompt(prompt);
        break;
      case "/end":
        message = "Goodbye!, send /start to start a new session.";
        this.mongodbService.removeChat(telegramWebhookPayload);
        break;
      default:
        const chat = await this.mongodbService.getChat(telegramWebhookPayload);
        message = await this.gptService.generateText(prompt, chat);
        this.mongodbService.saveChat(telegramWebhookPayload, message);
        break;
    }

    const result: WebhookResultDto = {
      chatId: telegramWebhookPayload.message.chat.id,
      message,
      image,
    };

    await this.webhookService.postWebhook(result);
  }
}
