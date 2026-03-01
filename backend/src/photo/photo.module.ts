import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  exports: [PhotoService],
  imports: [PrismaModule],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
