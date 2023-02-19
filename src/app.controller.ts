import { Controller, Get, Query, Res, Next } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ChatGPTQuery } from './app.dto';
import { Response, NextFunction } from 'express';

@ApiTags('blog')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('/notion')
  async getNotionPage(@Query('page_id') pageId: string) {
    return await this.appService.getNotionPage(pageId);
  }

  @ApiQuery({ name: 'conversation_id', required: false })
  @ApiQuery({ name: 'parent_message_id', required: false })
  @Get('/openai')
  async sendMessageToChatGPT(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Query('message') message: string,
    @Query('conversation_id') conversationId?: string,
    @Query('parent_message_id') parentMessageId?: string,
  ) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    });
    await this.appService.sendMessageToChatGPT(
      new ChatGPTQuery(message, conversationId, parentMessageId),
      res,
    );
    next();
  }
}
