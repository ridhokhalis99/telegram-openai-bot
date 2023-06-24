import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { GptService } from "src/gpt/gpt.service";
import { MongodbService } from "src/mongodb/mongodb.service";
import { ImageGeneratorService } from "src/image-generator/image-generator.service";
import { CloudVisionService } from "src/cloud-vision/cloud-vision.service";
import { TelegramService } from "src/telegram/telegram.service";

@Module({
  controllers: [WebhookController],
  providers: [
    WebhookService,
    GptService,
    MongodbService,
    ImageGeneratorService,
    CloudVisionService,
    TelegramService,
  ],
})
export class WebhookModule {}
