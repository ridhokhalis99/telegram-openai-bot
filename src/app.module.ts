import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { WebhookModule } from "./webhook/webhook.module";
import { MongodbService } from "./mongodb/mongodb.service";
import { GptService } from "./gpt/gpt.service";
import { ImageGeneratorService } from "./image-generator/image-generator.service";

@Module({
  imports: [WebhookModule],
  controllers: [AppController],
  providers: [AppService, GptService, MongodbService, ImageGeneratorService],
})
export class AppModule {}
