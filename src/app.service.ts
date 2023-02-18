import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChatGPTQuery } from './app.dto';
import { Response } from 'express';

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);

export interface ChatResponse {
  text: string;
  id: string;
  conversationId: string;
}

@Injectable()
export class AppService implements OnModuleInit {
  chatgpt: any;
  private readonly logger = new Logger(AppService.name);

  async onModuleInit() {
    const openaiApiKey = process.env.OPENAI_API_KEY;
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
    let data: ChatResponse;
    if (!conversationId) {
      data = await this.chatgpt.sendMessage(message, {
        timeoutMs: 2 * 60 * 1000,
        onProgress: (partialResponse: ChatResponse) =>
          res.write(JSON.stringify(partialResponse)),
      });
    } else {
      data = await this.chatgpt.sendMessage(message, {
        conversationId,
        parentMessageId,
        timeoutMs: 2 * 60 * 1000,
        onProgress: (partialResponse: ChatResponse) =>
          res.write(JSON.stringify(partialResponse)),
      });
    }
    res.end();
  }
}
