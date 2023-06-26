# Telegram OpenAI Bot

Telegram OpenAI Bot is a powerful Telegram bot built using NestJS that integrates with OpenAI's natural language processing capabilities. It provides conversational text generation, image creation using DALL-E, OCR using Cloud Vision, and temporary storage using MongoDB. This bot enables users to interact with OpenAI's GPT-3.5 model, generate images, extract text from images, and store temporary data for future use.

## Features

- **Conversational Text Generation:** The bot utilizes OpenAI's GPT-3.5 model to provide advanced natural language processing capabilities. Users can engage in conversational interactions with the bot, asking questions, seeking advice, or simply having a chat.

- **Image Generation with DALL-E:** Leveraging DALL-E, an AI model that generates images from textual descriptions, the bot can create unique and imaginative images based on user prompts. Users can provide a description or concept, and the bot will generate an image representing the idea.

- **OCR with Google Cloud Vision:** The bot integrates with Google Cloud Vision OCR to extract text from images. Users can send images to the bot, and it will perform optical character recognition to extract any text present in the image. This feature is useful for digitizing printed text or capturing information from images.

- **Voice Transcription:** The bot seamlessly integrates with Whisper-1, enabling users to send voice notes for effortless transcription. The bot accurately transcribes the audio, extracting words and converting them into text. This invaluable feature simplifies the process of capturing information from audio sources.

## Getting Started

To set up and run the Telegram OpenAI Bot project, follow these steps:

1. **Clone the Repository:** Clone the repository to your local machine.
   git clone https://github.com/ridhokhalis99/telegram-openai-bot

2. **Install Dependencies:** Navigate to the cloned directory and install the required dependencies.

```
   cd telegram-openai-bot
   npm install
```

3. **Obtain API Keys:** Obtain the necessary API keys for OpenAI, MongoDB, Telegram Bot, and Google Cloud Vision OCR. Make sure to store the keys securely and update the configuration files accordingly.

4. **Configure MongoDB Connection:** Set up a local or remote MongoDB instance and update the MongoDB connection details in the project's configuration files.

5. **Configure Telegram Bot API Token:** Create a new Telegram bot and obtain the API token. Update the token in the project's configuration files.

6. **Start the Bot:** Run the following command to start the bot:

```
   npm run start
```

7. **Interact with the Bot:** Start a conversation with the bot on Telegram and use the available commands and features by sending appropriate messages.

## Usage

The Telegram OpenAI Bot supports the following commands and interactions:

- `/start`: Start the conversation with the bot.
- `/imagine [description]`: Generate an image based on the provided description or concept.
- `/scan [description]`: Extract text from the provided image using optical character recognition and response to it.
- `/help`: Get information on how to use the bot and its available commands.
- `/end`: End the conversation with the bot.
- `/transcribe`: Send a voice note without any commands to the bot, and it will perform transcription to extract words from the audio.

## Contributing

Contributions to the Telegram OpenAI Bot project are welcome! If you have ideas for new features, bug fixes, or improvements, please submit a pull request. Be sure to follow the project's code style and guidelines.

## Disclaimer

Please note that the Telegram OpenAI Bot is an open-source project developed independently and is not officially affiliated with OpenAI, DALL-E, Google Cloud Vision, or Telegram. While the bot strives to provide accurate and useful information, it may not always generate the desired results or exhibit perfect accuracy.

The bot's usage of OpenAI's GPT-3.5 model, DALL-E, and Google Cloud Vision OCR is subject to the terms and conditions set by the respective providers. Ensure that you comply with their usage policies and any applicable usage limits or costs.

The developers of the Telegram OpenAI Bot are not responsible for any misuse, damages, or liabilities resulting from the use of this bot. Use it at your own risk.

## Support and Feedback

For support, bug reports, or feedback regarding the Telegram OpenAI Bot, please create an issue on the project's GitHub repository. The developers and the community will do their best to assist you.

## License

This project is licensed under the MIT License. Feel free to modify and distribute the codebase according to the terms of the license.
