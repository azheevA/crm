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

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { text: string },
  ): Promise<void> {
    const userId = (client.data.user?.id as number) || 1;
    const newMessage = await this.chatService.createMessage(userId, payload);
    this.server.emit('recMessage', newMessage);
  }

  afterInit(server: any) {
    console.log(server);
  }
  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
}
