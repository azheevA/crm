import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadPhotoDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Выберите несколько файлов',
  })
  files: any[];

  @ApiProperty({ description: 'Id предмета', example: 1 })
  @IsString()
  @IsNotEmpty()
  itemId: string;
}
