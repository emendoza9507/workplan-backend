import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { User } from '@prisma/client';
import { CreateMessagetDto } from '../dto/create-message.dto';

@Injectable()
export class MessageService {
    constructor(private prismaService: PrismaService) {}

    async create(createMessageDto: CreateMessagetDto) {
        try {
            return await this.prismaService.message.create({
                data: createMessageDto,
                include: {
                    sender: true
                }
            })
        } catch(error) {
            throw error
        }
    }
}