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
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from './chat.dto';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
  email: string;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth?.token as string;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);
      const userId = payload.sub;
      client.data.user = { id: userId };

      const userChats = await this.chatService.getUserChats(userId);
      const roomIds = userChats.map((chat) => `chat_${chat.id}`);

      await client.join(roomIds);
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

    if (dto.dealId) {
      this.server.to(`deal_${dto.dealId}`).emit('activityCreated');
    }
  }
}
