import { Injectable } from "@nestjs/common";
import * as TelegramBot from "node-telegram-bot-api";
import { WebhookResultDto } from "./dto/webhook-telegram-bot";

@Injectable()
export class WebhookService {
  private readonly bot: TelegramBot;
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_API_KEY);
  }

  async postWebhook(result: WebhookResultDto) {
    const { chatId, imageUrl, message } = result;
    if (imageUrl) return this.bot.sendPhoto(chatId, imageUrl);
    this.bot.sendMessage(chatId, message);
  }
}
