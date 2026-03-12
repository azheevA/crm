import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  MessageResponseDto,
  GetMessagesQueryDto,
  ChatResponseDto,
  CreateChatDto,
  AddMembersDto,
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
    const cursorId = query.cursor ?? undefined;

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
  @Post()
  @ApiOperation({ summary: 'Создать новый чат' })
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateChatDto })
  async create(
    @sessionInfo() session: SessionData,
    @Body() dto: CreateChatDto,
  ) {
    return this.chatService.createChat(session.id, dto);
  }
  @Post(':chatId/members')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Добавить участников в чат' })
  @ApiBody({ type: AddMembersDto })
  @ApiResponse({ status: 201, description: 'Участники добавлены' })
  async addMembers(
    @sessionInfo() session: SessionData,
    @Param('chatId') chatId: string,
    @Body() dto: AddMembersDto,
  ) {
    const isAdmin = await this.chatService.checkAdmin(
      session.id,
      Number(chatId),
    );
    if (!isAdmin) {
      throw new ForbiddenException('Вы не можете добавлять участников');
    }

    return this.chatService.addMembers(Number(chatId), dto);
  }
}
