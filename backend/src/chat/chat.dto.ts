import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Привет, как дела?', description: 'Текст сообщения' })
  @IsString()
  @MinLength(1)
  text: string;

  @ApiPropertyOptional({
    type: [Number],
    description: 'ID прикрепленных файлов',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  fileIds?: number[];

  @ApiPropertyOptional({ example: 1, description: 'ID сделки' })
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
}

export class MessageResponseDto {
  @ApiProperty({ type: [MessageDto] })
  data: MessageDto[];

  @ApiProperty({ type: Number, nullable: true })
  nextCursor: number | null;
}

export class GetMessagesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  skip?: number;
}
