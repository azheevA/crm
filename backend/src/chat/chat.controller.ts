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
  ApiConsumes,
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
import { PhotoService } from 'src/photo/photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private photo: PhotoService,
  ) {}

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
  @Patch(':chatId/avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Загрузить аватарку чата' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/chat',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAvatar(
    @sessionInfo() session: SessionData,
    @Param('chatId') chatId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.updateChatAvatar(session.id, Number(chatId), file);
  }
  @Get(':chatId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить чат по id' })
  @ApiOkResponse({ type: ChatResponseDto })
  async getChat(
    @sessionInfo() session: SessionData,
    @Param('chatId') chatId: string,
  ) {
    const chat = await this.chatService.getChatById(Number(chatId));

    if (!chat) {
      throw new ForbiddenException();
    }

    const isMember = chat.members.some(
      (member) => member.userId === session.id,
    );

    if (!isMember) {
      throw new ForbiddenException('Вы не участник чата');
    }

    return chat;
  }
}
