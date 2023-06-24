import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { WebhookModule } from "./webhook/webhook.module";
import { MongodbService } from "./mongodb/mongodb.service";
import { GptService } from "./gpt/gpt.service";
import { ImageGeneratorService } from "./image-generator/image-generator.service";
import { CloudVisionService } from "./cloud-vision/cloud-vision.service";
import { TelegramService } from "./telegram/telegram.service";

@Module({
  imports: [WebhookModule],
  controllers: [AppController],
  providers: [
    AppService,
    GptService,
    MongodbService,
    ImageGeneratorService,
    CloudVisionService,
    TelegramService,
  ],
})
export class AppModule {}
