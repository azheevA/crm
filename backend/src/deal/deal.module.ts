import { Module } from '@nestjs/common';
import { DealService } from './deal.service';
import { DealController } from './deal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityModule } from 'src/activity/activity.module';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [PrismaModule, ActivityModule, PhotoModule],
  controllers: [DealController],
  providers: [DealService],
})
export class DealModule {}
