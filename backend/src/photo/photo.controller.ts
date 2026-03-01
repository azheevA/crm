import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFiles,
  Delete,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        itemId: {
          type: 'string',
          example: '1',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['itemId', 'files'],
    },
  })
  async uploadPhoto(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('itemId') itemId: string,
  ) {
    return this.photoService.AddPhoto(Number(itemId), files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить фотографию по ID' })
  async removePhoto(@Param('id') id: string) {
    return await this.photoService.deletePhoto(Number(id));
  }
}
