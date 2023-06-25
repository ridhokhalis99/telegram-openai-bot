import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import axios from "axios";

async function resetWebhook() {
  await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}/deleteWebhook`
  );
  await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}/setWebhook?url=${process.env.WEBHOOK_URL}`
  );
}

async function bootstrap() {
  const port = process.env.PORT || 3000;
  await resetWebhook();
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
