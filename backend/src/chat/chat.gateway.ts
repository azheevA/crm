import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './chat.dto';
import { ValidationPipe } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody(new ValidationPipe()) dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.id as number;
    const newMessage = await this.chatService.createMessage(userId, dto);
    if (dto.dealId) {
      this.server.to(`deal_${dto.dealId}`).emit('recMessage', newMessage);
    } else {
      this.server.emit('recMessage', newMessage);
    }
  }

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }
  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
}
