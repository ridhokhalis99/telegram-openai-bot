export interface Photo {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}
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
    photo: Photo[];
    caption: string;
  };
}

export class WebhookResultDto {
  chatId: number;
  message: string;
  imageUrl?: string;
}
