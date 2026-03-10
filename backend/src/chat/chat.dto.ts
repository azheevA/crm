import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Привет!' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  text?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  chatId: number;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  fileIds?: number[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  dealId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  replyToId?: number;
}

export class AvatarDto {
  @ApiProperty()
  url: string;
}

export class AuthorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: AvatarDto })
  avatar?: AvatarDto;
}

export class MessageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty()
  chatId: number;
}

export class ChatResponseDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  title?: string;

  @ApiProperty()
  isGroup: boolean;

  @ApiProperty({ type: [AuthorDto] })
  members: AuthorDto[];
}

export class MessageResponseDto {
  @ApiProperty({ type: [MessageDto] })
  data: MessageDto[];

  @ApiProperty({ type: Number, nullable: true })
  nextCursor: number | null;
}

export class GetMessagesQueryDto {
  @ApiProperty()
  @IsInt()
  chatId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  cursor?: number;
}
export class CreateChatDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @IsInt({ each: true })
  memberIds: number[];
}
export class ReadMessagesDto {
  @IsInt()
  chatId: number;

  @IsInt()
  messageId: number;
}
export class AddReactionDto {
  @IsInt()
  messageId: number;

  @IsString()
  emoji: string;
}
export class PinMessageDto {
  @IsInt()
  chatId: number;

  @IsInt()
  messageId: number;
}
export class EditMessageDto {
  @IsInt()
  messageId: number;

  @IsString()
  text: string;
}
