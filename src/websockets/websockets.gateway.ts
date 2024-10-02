import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from "socket.io"
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/services/chat.service';
import { CreateMessagetDto } from 'src/chat/dto/create-message.dto';
import { MessageService } from 'src/chat/services/message.service';

type Message = {
    to?: User
    from: User
    text: string
    createdAt: Date
}

type ChanneMessage = {
    to: string,
    from: User,
    message: string
}


@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WebsocketGateway {
    constructor(
        private prismaService: PrismaService,
        private chatService: ChatService,
        private messageService: MessageService,
        private jwtService: JwtService
    ) { }

    @WebSocketServer()
    server: Server;

    globalChannel: { [key: string]: User & { socketId: string } } = {}

    @SubscribeMessage('user.list')
    findAll(@MessageBody() data: any) {

        return Object.values(this.globalChannel);
    }

    @SubscribeMessage('message')
    async message(@ConnectedSocket() client: Socket, @MessageBody() data: ChanneMessage) {
        console.log(client.id)
        const message: Message = {
            from: data.from,
            text: data.message,
            createdAt: new Date
        }

        this.server.emit("message:new", message)
    }

    @SubscribeMessage('channel:message')
    async chanelMessage(@ConnectedSocket() client: Socket, @MessageBody() data: ChanneMessage) {
        console.log(this.globalChannel[client.id])
        try {
            const message: Message = {
                to: await this.prismaService.user.findUnique({ where: { id: +data.to } }),
                from: await this.prismaService.user.findUnique({ where: { id: +data.from } }),
                text: data.message,
                createdAt: new Date
            }


            this.server.emit(`channel:user:${message.to.id}`, message)
            this.server.emit(`channel:user:${message.from.id}`, message)
        } catch {

        }
    }

    @SubscribeMessage('chat:join')
    handleChatJoin(@ConnectedSocket() client: Socket, @MessageBody() chatId: string) {
        client.join(chatId)
        console.log('Client joined to chat: '+chatId)
    }

    @SubscribeMessage('chat:send:message')
    async handleMessageOnChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { chatId: string, userId: string, text: string }) {
        const messageDto: CreateMessagetDto = { chatId: +payload.chatId, senderId: +payload.userId, text: payload.text }
        const message = await this.messageService.create(messageDto);
        this.server.to(payload.chatId).emit('chat:resive:message', message);
    }

    @SubscribeMessage('user.connect')
    async newUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {                  
        this.server.to('global').emit('user.connect', data)        
    }

    async handleConnection(client: Socket) {
        client.join('global')
    }


    handleDisconnect(client: Socket, ...arg) {
        delete this.globalChannel[client.id]
        this.server.emit('user.disconnect', client.id, arg)
    }
}