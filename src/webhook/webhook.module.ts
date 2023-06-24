import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { GptService } from "src/gpt/gpt.service";
import { MongodbService } from "src/mongodb/mongodb.service";
import { ImageGeneratorService } from "src/image-generator/image-generator.service";

@Module({
  controllers: [WebhookController],
  providers: [
    WebhookService,
    GptService,
    MongodbService,
    ImageGeneratorService,
  ],
})
export class WebhookModule {}
