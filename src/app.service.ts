import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGPTQuery } from './app.dto';
import { Response } from 'express';

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);

@Injectable()
export class AppService implements OnModuleInit {
  chatgpt: any;
  private readonly logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY missing');
    }

    const { ChatGPTAPI } = await importDynamic('chatgpt');

    try {
      this.logger.log('Creating ChatCPT');
      this.chatgpt = new ChatGPTAPI({
        apiKey: openaiApiKey,
      });
    } catch (e) {
      console.log(e);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendMessage(query: ChatGPTQuery, res: Response) {
    const { message, conversationId, parentMessageId } = query;
    this.logger.log(`Send Message ${message}`);
    let response;
    if (!conversationId) {
      response = await this.chatgpt.sendMessage(message, {
        timeoutMs: 2 * 60 * 1000,
        onProgress: (partialResponse) => res.write(partialResponse.text),
      });
    } else {
      response = await this.chatgpt.sendMessage(message, {
        conversationId,
        parentMessageId,
        timeoutMs: 2 * 60 * 1000,
        onProgress: (partialResponse) => res.write(partialResponse.text),
      });
    }
    res.write(response.text ?? '');
    res.end();
  }
}
