import { Injectable } from "@nestjs/common";

@Injectable()
export class GptService {
    constructor() {}

    async generateText(text: string): Promise<void> {
        console.log(text);
    }
}