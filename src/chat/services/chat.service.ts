import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { User } from '@prisma/client';

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) { }

    async create(createChatDto: CreateChatDto) {
        try {
            return this.prismaService.chat.create({
                data: {
                    participants: {
                        connect: createChatDto.participants.map(u => ({ id: u.id }))
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    findAll() {
        return this.prismaService.chat.findMany();
    }

    async findOne(participants: User[]) {
        return (await this.prismaService.user.findUnique({
            where: { id: participants[0].id },
            include: {
                chats: {
                    take: 1,
                    where: {
                        participants: {
                            every: { id: { in: participants.map(u => u.id) } },                            
                        }
                    },
                    include: {
                        messages: true
                    }
                },
            }
        })).chats[0];
    }
}
