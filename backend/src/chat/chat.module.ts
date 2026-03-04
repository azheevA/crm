import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [PrismaModule, ActivityModule],
})
export class ChatModule {}
