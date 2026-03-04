import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { DealService } from './deal.service';
import { CreateDealDto, UpdateDealDto } from './deal.dto';
import { PhotoService } from 'src/photo/photo.service';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { type SessionData, sessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('Deals')
@Controller('deals')
export class DealController {
  constructor(
    private readonly dealService: DealService,
    private readonly photoService: PhotoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую сделку' })
  create(
    @sessionInfo() session: SessionData,
    @Body() createDealDto: CreateDealDto,
  ) {
    return this.dealService.create(session.id as number, createDealDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список всех сделок' })
  findAll() {
    return this.dealService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить статус или данные сделки' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @sessionInfo() session: SessionData,
    @Body() updateDealDto: UpdateDealDto,
  ) {
    return this.dealService.update(id, session.id as number, updateDealDto);
  }
  @Post(':id/upload')
  @ApiOperation({ summary: 'Загрузить документы к сделке' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './deal-uploads',
        filename: (req, file, callback) => {
          const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${name}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadDealFiles(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.photoService.uploadDealFiles(id, files);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить сделку' })
  @ApiResponse({ status: 200, description: 'Сделка успешно удалена.' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @sessionInfo() session: SessionData,
  ) {
    return this.dealService.remove(id, session.id as number);
  }
}
