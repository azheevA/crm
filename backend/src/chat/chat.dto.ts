import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  text: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  fileIds?: number[];
}
