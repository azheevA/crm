import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages(
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const take = limit ? parseInt(limit, 10) : 20;
    const cursorId = cursor ? parseInt(cursor, 10) : undefined;

    const messages = await this.chatService.getMessages(take, cursorId);
    return {
      data: messages,
      nextCursor:
        messages.length === take ? messages[messages.length - 1].id : null,
    };
  }
}
