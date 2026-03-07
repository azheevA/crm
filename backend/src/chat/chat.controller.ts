import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageResponseDto, GetMessagesQueryDto } from './chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  @ApiOperation({ summary: 'Получить список сообщений' })
  @ApiOkResponse({ type: MessageResponseDto })
  async getMessages(@Query() query: GetMessagesQueryDto) {
    const take = query.limit ?? 20;
    const cursorId = query.skip ?? undefined;

    const messages = await this.chatService.getMessages(take, cursorId);

    return {
      data: messages,
      nextCursor:
        messages.length === take ? messages[messages.length - 1].id : null,
    };
  }
}
