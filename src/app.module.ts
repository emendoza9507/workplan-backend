import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { WorkplanModule } from './workplan/workplan.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './websockets/websockets.module';

@Module({
  imports: [UsersModule, WorkplanModule, AuthModule, SocketModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

