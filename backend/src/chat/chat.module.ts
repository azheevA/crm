import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityModule } from 'src/activity/activity.module';
import { ChatController } from './chat.controller';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  imports: [PrismaModule, ActivityModule, PhotoModule],
  exports: [ChatService],
})
export class ChatModule {}
