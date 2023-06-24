export interface TelegramWebhookPayload {
  update_id: number;
  message: {
    message_id: number;
    text: string;
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      type: string;
    };
  };
}

export class WebhookResultDto {
  chatId: number;
  message: string;
}
