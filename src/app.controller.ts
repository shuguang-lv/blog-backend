import { Controller, Get, Post, Body, Res, Next } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ChatGPTQuery } from './app.dto';
import { Response, NextFunction } from 'express';

@ApiTags('blog')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/openai')
  async sendMessage(
    @Body() chatGPTQuery: ChatGPTQuery,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    });
    await this.appService.sendMessage(chatGPTQuery, res);
    next();
  }
}
