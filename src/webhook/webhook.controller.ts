import { Controller, Post, Body } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import {
  TelegramWebhookPayload,
  WebhookResultDto,
} from "./dto/webhook-telegram-bot";
import { GptService } from "src/gpt/gpt.service";
import { MongodbService } from "src/mongodb/mongodb.service";

@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly gptService: GptService,
    private readonly mongodbService: MongodbService
  ) {}

  @Post("/")
  async postWebhook(
    @Body() telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<void> {
    const prompt = telegramWebhookPayload?.message?.text;
    let message: string;

    switch (prompt) {
      case "/start":
        message = await this.gptService.generateText(prompt);
        this.mongodbService.saveChat(telegramWebhookPayload);
        break;
      default: 
        message = await this.gptService.generateText(prompt);
        this.mongodbService.saveChat(telegramWebhookPayload);
        break;
    }

    const result: WebhookResultDto = {
      chatId: telegramWebhookPayload.message.chat.id,
      message,
    };

    await this.webhookService.postWebhook(result);
  }
}
