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

    async findOne(participants: User[], page: number = 1) {
        return await this.prismaService.chat.findFirst({
            where: {
                participants: {
                    every: { id: { in: participants.map(u => +u.id) } }
                }
            },
            include: {
                messages: {
                    take: -10 ,
                    skip: 10 * (page - 1),
                    include: {
                        sender: true,
                        file: true
                    }
                }
            }
        })
    }

    async findById(id: number, page: number = 1) {
        return this.prismaService.chat.findUnique({
            where: { id },
            include: {
                participants: true,
                messages: {
                    take: -10 ,
                    skip: 10 * (page - 1),
                    include: {
                        sender: true,
                        file: true
                    }
                }
            }
        })
    }
}
