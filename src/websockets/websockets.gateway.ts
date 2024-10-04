import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from "socket.io"
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


class GlobalChannel {
    constructor ( private users: { [key: string]: User } ) {}

    addUser(key: string, user: User) {
        this.users[key] = user;
    }

    getUserByKey(key: string) {
        return this.users[key];
    }

    getUserById(id: number) {
        return Object.values(this.users).find(u => u.id === id);
    }
    
    getAll() {
        return Object.entries(this.users)
    }

    removeUser(key: string) {
        const user = {...this.users[key]}
        delete this.users[key];
        return [key, user]
    }
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    protected globalChannel: GlobalChannel = new GlobalChannel({})
    
    constructor(
        private prismaService: PrismaService,
        private chatService: ChatService,
        private messageService: MessageService,
        private jwtService: JwtService
    ) { 
        
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('user.list')
    findAll(@MessageBody() data: any) {

        return this.globalChannel.getAll();
    }

    @SubscribeMessage('message')
    async message(@ConnectedSocket() client: Socket, @MessageBody() data: ChanneMessage) {
        const message: Message = {
            from: data.from,
            text: data.message,
            createdAt: new Date
        }

        this.server.emit("message:new", message)
    }

    @SubscribeMessage('channel:message')
    async chanelMessage(@ConnectedSocket() client: Socket, @MessageBody() data: ChanneMessage) {
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
        console.log(`Client ${client.id} joined to chat: `+chatId)
    }

    @SubscribeMessage('chat:send:message')
    async handleMessageOnChatRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { chatId: string, userId: string, text: string }) {
        const messageDto: CreateMessagetDto = { chatId: +payload.chatId, senderId: +payload.userId, text: payload.text }
        const message = await this.messageService.create(messageDto);
        this.server.to(payload.chatId).emit('chat:resive:message', message);
        
        this.globalChannel.getAll().forEach(([socketId, user]) => {
            if(socketId !== client.id) {
                this.server.to(socketId).emit('chat:resive:notification', message)
            }
        })
    }

    @SubscribeMessage('join.global')
    async newUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) { 
        client.join('global')
        // client.emit('join.global', this.globalChannel.getAll())            ;
        this.globalChannel.addUser(client.id, data)      
        this.server.to('global').emit('join.global', this.globalChannel.getAll())    
        
    }

    async handleConnection(@ConnectedSocket() client: Socket) {
        
    }


    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.globalChannel.removeUser(client.id)
        this.server.to('global').emit('out.global', this.globalChannel.getAll())
    }
}