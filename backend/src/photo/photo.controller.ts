import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFiles,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PhotoService } from './photo.service';

@ApiTags('Photos')
@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${name}${extname(file.originalname)}`);
        },
      }),
    }),
  )
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
  @ApiConsumes('multipart/form-data')
  async uploadPhoto(@UploadedFiles() files: Express.Multer.File[]) {
    return this.photoService.uploadGallery(files);
  }

  @Delete(':id')
  async removePhoto(@Param('id', ParseIntPipe) id: number) {
    return await this.photoService.deletePhoto(id);
  }
}
