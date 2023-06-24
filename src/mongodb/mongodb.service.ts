import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { TelegramWebhookPayload } from "src/webhook/dto/webhook-telegram-bot";

@Injectable()
export class MongodbService {
  private mongoClient: MongoClient;

  constructor() {
    this.mongoClient = new MongoClient(process.env.MONGO_DB_URI);
  }

  async run() {
    try {
      await this.mongoClient.connect();

    } finally {
      await this.mongoClient.close();
    }
  }

  async saveChat(telegramWebhookPayload: TelegramWebhookPayload) {
    try {
      await this.mongoClient.connect();
      const database = this.mongoClient.db('chatbot');
      const collection = database.collection('chat');
      const { first_name, last_name, id } = telegramWebhookPayload.message.chat;
      const newMessage = {
        role: 'user',
        content: telegramWebhookPayload.message.text,
      };
      const filter = { chatId: id };
      const update = { $push: { messages: newMessage }, $setOnInsert: { name: `${first_name} ${last_name}`, chatId: id } };
      const options = { upsert: true };
      const result = await collection.updateOne(filter, update, options);
      console.log(result);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to connect to MongoDB.');
    } finally {
      await this.mongoClient.close();
    }
  }
  
}
