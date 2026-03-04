import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PhotoService } from './photo.service';
import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Photos')
@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}
  @Post('chat')
  @ApiOperation({ summary: 'Загрузить файлы для сообщения в чате' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['files'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/chat',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `chat-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadChatFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.photoService.uploadChatFiles(files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить фото' })
  async removePhoto(@Param('id', ParseIntPipe) id: number) {
    return await this.photoService.deletePhoto(id);
  }
}
