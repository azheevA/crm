import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [PrismaModule, ActivityModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
