import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('New Client connected..', client.id);

    //broadcast this message to all users except sender
    client.broadcast.emit('user-joined', {
      message: `New User Joined the Chat: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('User Disconected..', client.id);

    this.server.emit('user-left', {
      message: `User Left the Chat: ${client.id}`,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('message', message); //Broadcast msg to all clients except sender
  }
}

export default ChatGateway;
