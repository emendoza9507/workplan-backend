import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatController } from './chat.controller';
import { MessageService } from './services/message.service';

@Module({
  providers: [ChatService, MessageService, PrismaService],
  exports: [ChatService, MessageService],
  controllers: [ChatController]
})
export class ChatModule {}
