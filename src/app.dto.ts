import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChatGPTQuery {
  constructor(message, conversationId?, parentMessageId?) {
    this.message = message;
    this.conversationId = conversationId;
    this.parentMessageId = parentMessageId;
  }

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  parentMessageId?: string;
}
