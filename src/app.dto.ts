import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChatGPTQuery {
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
