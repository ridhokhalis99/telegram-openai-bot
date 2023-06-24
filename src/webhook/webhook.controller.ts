import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { TelegramWebhookPayload, WebhookResultDto } from './dto/webhook-telegram-bot';
import { GptController } from 'src/gpt/gpt.controller';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/')
  async postWebhook(@Body() telegramWebhookPayload: TelegramWebhookPayload): Promise<void> {
    const prompt = telegramWebhookPayload?.message?.text;
    let message: string;

    switch (prompt) {
      case '/start':
        message = await GptController.generateText(prompt);
        break;
      default:
        message = await GptController.generateText(prompt);
        break;
      }

    const result: WebhookResultDto = {
      chatId: telegramWebhookPayload.message.chat.id,
      message,
    };

    await this.webhookService.postWebhook(result);
  }
}
