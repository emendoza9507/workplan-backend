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


    @SubscribeMessage('user.connect')
    async newUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        try {
            const userChecked = await this.jwtService.verifyAsync(data.access_token, {
                secret: process.env.JWT_SECRET
            });

            if (userChecked) {
                const user = await this.prismaService.user.findUnique({
                    where: { id: userChecked.id }
                })

                const findUser = Object.values(this.globalChannel).find((u) => u.id === user.id);

                if (!findUser) {
                    this.globalChannel[client.id] = { ...user, socketId: client.id }

                    client.broadcast.emit('user.connect', this.globalChannel[client.id])
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async handleConnection(client: Socket) {
        const user = this.jwtService.decode(client.handshake.auth.token)
        // console.log(client.id)
        if(user !== null) {
        //     console.log('entro')
            this.chanelMessage[client.id] = { ...user, socketId: client.id }
            
        //     // client.broadcast.emit('user.connect', user)
        }
        // return client.broadcast.emit('user.connect', this.chanelMessage[client.id])        
    }


    handleDisconnect(client: Socket) {
        delete this.globalChannel[client.id]

        this.server.emit('user.disconnect', client.id)

        console.log('entro')
    }
}