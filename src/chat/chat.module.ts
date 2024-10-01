import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatService, PrismaService],
  exports: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
