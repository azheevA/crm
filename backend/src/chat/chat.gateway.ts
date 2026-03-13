import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  AddReactionDto,
  CreateMessageDto,
  EditMessageDto,
  PinMessageDto,
  ReadMessagesDto,
} from './chat.dto';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
interface JwtPayload {
  id: number;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const cookieHeader = client.handshake.headers.cookie;

      if (!cookieHeader) {
        client.disconnect();
        return;
      }
      const cookies = cookie.parse(cookieHeader);

      const token = cookies['access-token'];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      client.data.user = { id: payload.id };

      const userChats = await this.chatService.getUserChats(payload.id);
      const roomIds = userChats.map((m) => `chat_${m.chat.id}`);

      await client.join(roomIds);
      await client.join(`user_${payload.id}`);
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody('chatId') chatId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.data.user.id as number;

    const hasAccess = await this.chatService.isChatMember(userId, chatId);

    if (!hasAccess) {
      client.emit('error', {
        message: 'Forbidden: You are not a member of this chat',
      });
      return;
    }

    await client.join(`chat_${chatId}`);
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody('chatId') chatId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(`chat_${chatId}`);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.data.user.id as number;
    const newMessage = await this.chatService.createMessage(userId, dto);

    this.server.to(`chat_${dto.chatId}`).emit('recMessage', newMessage);
    this.server
      .to(`user_${userId}`)
      .emit('chatUpdated', { chatId: dto.chatId, message: newMessage });
    if (dto.dealId) {
      this.server.to(`deal_${dto.dealId}`).emit('activityCreated');
    }
    const members = await this.chatService.getChatMembers(dto.chatId);

    members.forEach((member) => {
      this.server.to(`user_${member.userId}`).emit('chatUpdated', {
        chatId: dto.chatId,
        message: newMessage,
      });
    });
  }
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody('chatId') chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.id as number;

    client.to(`chat_${chatId}`).emit('typing', {
      userId,
    });
  }
  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody() dto: EditMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.id as number;

    const message = await this.chatService.editMessage(userId, dto);

    this.server.to(`chat_${message.chatId}`).emit('messageEdited', message);
  }
  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody('messageId') messageId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.id as number;

    const message = await this.chatService.deleteMessage(userId, messageId);

    this.server.to(`chat_${message.chatId}`).emit('messageDeleted', {
      messageId,
    });
  }
  @SubscribeMessage('reaction')
  async handleReaction(
    @MessageBody() dto: AddReactionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.id as number;

    const reaction = await this.chatService.addReaction(userId, dto);

    const message = await this.chatService.getOneMessage(dto.messageId);

    if (!message) return;

    this.server.to(`chat_${message.chatId}`).emit('reactionAdded', reaction);
  }
  @SubscribeMessage('read')
  async handleRead(
    @MessageBody() dto: ReadMessagesDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.id as number;

    await this.chatService.markAsRead(userId, dto);

    this.server.to(`chat_${dto.chatId}`).emit('messagesRead', {
      userId,
      messageId: dto.messageId,
    });
  }
  @SubscribeMessage('pinMessage')
  async handlePin(@MessageBody() dto: PinMessageDto) {
    await this.chatService.pinMessage(dto);
    this.server.to(`chat_${dto.chatId}`).emit('messagePinned', dto);
  }

  emitChatAdded(userId: number, chatId: number) {
    this.server.to(`user_${userId}`).emit('chatAdded', {
      chatId,
    });
  }
}
