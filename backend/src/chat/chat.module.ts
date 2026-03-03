import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [PrismaModule],
})
export class ChatModule {}
