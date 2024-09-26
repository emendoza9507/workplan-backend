import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { WorkplanModule } from './workplan/workplan.module';

@Module({
  imports: [UsersModule, WorkplanModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
