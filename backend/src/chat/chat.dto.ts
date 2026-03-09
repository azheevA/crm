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
  @MinLength(1)
  text: string;

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

  @ApiProperty({ type: [Number] })
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
  skip?: number;
}
