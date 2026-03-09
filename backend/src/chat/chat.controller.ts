import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  MessageResponseDto,
  GetMessagesQueryDto,
  ChatResponseDto,
} from './chat.dto';
import { AuthGuard, type SessionData } from 'src/auth/auth.guard';
import { sessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('my-chats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Список моих чатов' })
  @ApiOkResponse({ type: [ChatResponseDto] })
  async getMyChats(@sessionInfo() session: SessionData) {
    return this.chatService.getUserChats(session.id);
  }

  @Get('messages')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'История сообщений чата' })
  @ApiOkResponse({ type: MessageResponseDto })
  async getMessages(@Query() query: GetMessagesQueryDto) {
    const take = query.limit ?? 20;
    const cursorId = query.skip ?? undefined;

    const messages = await this.chatService.getMessages(
      query.chatId,
      take,
      cursorId,
    );

    return {
      data: messages,
      nextCursor:
        messages.length === take ? messages[messages.length - 1].id : null,
    };
  }
}
