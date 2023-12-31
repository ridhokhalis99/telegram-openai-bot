import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class TelegramService {
  async getImageFile(fileId: string): Promise<Buffer> {
    try {
      const responseFilePath = await axios.get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}/getFile?file_id=${fileId}`
      );
      const filePath = responseFilePath.data.result.file_path;
      const responseImageFile = await axios.get(
        `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_API_KEY}/${filePath}`,
        { responseType: "arraybuffer" }
      );
      const imageFile = Buffer.from(responseImageFile.data, "binary");
      return imageFile;
    } catch (error) {
      console.log(error.message, "Failed to connect to Telegram.");
    }
  }

  async getVoiceFile(fileId: string): Promise<Buffer> {
    const responseFilePath = await axios.get(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}/getFile?file_id=${fileId}`
    );
    const filePath = responseFilePath.data.result.file_path;
    const responseVoiceFile = await axios.get(
      `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_API_KEY}/${filePath}`,
      { responseType: "arraybuffer" }
    );
    const voiceFile = Buffer.from(responseVoiceFile.data, "binary");
    return voiceFile;
  }
}
