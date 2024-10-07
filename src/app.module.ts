import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { WorkplanModule } from './workplan/workplan.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './websockets/websockets.module';
import { ChatModule } from './chat/chat.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    UsersModule,
    WorkplanModule,
    AuthModule,
    SocketModule,
    ChatModule,
    FileModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }

