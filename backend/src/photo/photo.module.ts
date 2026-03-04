import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CleanupService } from './cleanup/cleanup.service';

@Module({
  exports: [PhotoService],
  imports: [PrismaModule],
  controllers: [PhotoController],
  providers: [PhotoService, CleanupService],
})
export class PhotoModule {}
