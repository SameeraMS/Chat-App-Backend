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
  private clients: { [key: string]: string } = {}; // Track clients and their usernames

  handleConnection(client: Socket) {
    console.log('New Client connected..', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('User Disconnected..', client.id);

    const username = this.clients[client.id];
    if (username) {
      delete this.clients[client.id];
      this.server.emit('user-left', {
        message: `${username} left the chat`,
        users: Object.values(this.clients), // Updated list of users
      });
    }
  }

  @SubscribeMessage('register-user')
  handleRegisterUser(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`User ${username} registered with ID: ${client.id}`);
    this.clients[client.id] = username;

    // Broadcast the new user's info and updated user list
    client.broadcast.emit('user-joined', {
      message: `${username} joined the chat`,
      users: Object.values(this.clients),
    });

    // Send the updated users list to all clients
    this.server.emit('all-users', { users: Object.values(this.clients) });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(
    @MessageBody() message: { text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.clients[client.id];
    console.log(`Message from ${username}: ${message.text}`);
    client.broadcast.emit('message', { message: message.text, username });
  }
}

export default ChatGateway;
