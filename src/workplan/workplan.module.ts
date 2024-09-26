import { Module } from '@nestjs/common';
import { WorkplanService } from './services/workplan.service';
import { PeriodService } from './services/period.service';
import { WorkplanController } from './workplan.controller';
import { PeriodController } from './controllers/period.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [WorkplanController, PeriodController],
  providers: [WorkplanService, PeriodService, PrismaService],
})
export class WorkplanModule {}
