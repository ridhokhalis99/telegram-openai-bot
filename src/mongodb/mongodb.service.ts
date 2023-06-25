import { Injectable } from "@nestjs/common";
import { MongoClient, WithId } from "mongodb";
import { TelegramWebhookPayload } from "src/webhook/dto/webhook-telegram-bot";
import { ChatDocument } from "./dto/chat-document";

@Injectable()
export class MongodbService {
  private mongoClient: MongoClient;

  constructor() {
    this.mongoClient = new MongoClient(process.env.MONGO_DB_URI);
  }

  async getChat(telegramWebhookPayload: TelegramWebhookPayload) {
    try {
      await this.mongoClient.connect();
      const database = this.mongoClient.db("chatbot");
      const collection = database.collection("chat");
      const { id } = telegramWebhookPayload.message.chat;
      const filter = { chatId: id };
      const chat = await collection.findOne(filter);
      return chat;
    } catch (error) {
      throw new Error("Failed to connect to MongoDB.");
    } finally {
      await this.mongoClient.close();
    }
  }

  async saveChat(
    telegramWebhookPayload: TelegramWebhookPayload,
    gptResponse?: string,
    transription?: string
  ): Promise<void> {
    try {
      await this.mongoClient.connect();
      const database = this.mongoClient.db("chatbot");
      const collection = database.collection("chat");
      const { first_name, last_name, id } = telegramWebhookPayload.message.chat;
      const messageContent =
        telegramWebhookPayload.message.text ||
        telegramWebhookPayload.message.caption ||
        transription
      if (!messageContent) return;
      const newMessage = {
        role: "user",
        content: messageContent,
      };
      const gptMessage = {
        role: "assistant",
        content: gptResponse,
      };
      const filter = { chatId: id };
      const update = {
        $push: {
          messages: { $each: [newMessage, gptMessage] },
        },
        $setOnInsert: { name: `${first_name} ${last_name}`, chatId: id },
      };
      const options = { upsert: true };
      await collection.updateOne(filter, update, options);
    } catch (error) {
      throw new Error("Failed to connect to MongoDB.");
    } finally {
      await this.mongoClient.close();
    }
  }

  async removeChat(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<void> {
    try {
      await this.mongoClient.connect();
      const database = this.mongoClient.db("chatbot");
      const collection = database.collection("chat");
      const { id } = telegramWebhookPayload.message.chat;
      const filter = { chatId: id };
      await collection.deleteOne(filter);
    } catch (error) {
      throw new Error("Failed to connect to MongoDB.");
    } finally {
      await this.mongoClient.close();
    }
  }

  async saveImage(
    telegramWebhookPayload: TelegramWebhookPayload,
    imageUrl: string
  ): Promise<void> {
    try {
      await this.mongoClient.connect();
      const database = this.mongoClient.db("chatbot");
      const collection = database.collection("chat");
      const { id } = telegramWebhookPayload.message.chat;
      const filter = { chatId: id };

      const oneDay = 24 * 60 * 60 * 1000;
      const expiration = new Date(Date.now() + oneDay);
      const update = {
        $set: {
          imageUrl,
          expiration,
        },
      };
      const options = { upsert: true };
      await collection.updateOne(filter, update, options);
    } catch (error) {
      throw new Error("Failed to connect to MongoDB.");
    } finally {
      await this.mongoClient.close();
    }
  }

  async getImage(
    telegramWebhookPayload: TelegramWebhookPayload
  ): Promise<string> {
    try {
      await this.mongoClient.connect();
      const database = this.mongoClient.db("chatbot");
      const collection = database.collection("chat");
      const { id } = telegramWebhookPayload.message.chat;
      const filter = { chatId: id };
      const chat = await collection.findOne(filter);
      return chat?.imageUrl;
    } catch (error) {
      throw new Error("Failed to connect to MongoDB.");
    } finally {
      await this.mongoClient.close();
    }
  }
}
