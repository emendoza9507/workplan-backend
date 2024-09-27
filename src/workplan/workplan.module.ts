import { Module } from '@nestjs/common';
import { WorkplanService } from './services/workplan.service';
import { PeriodService } from './services/period.service';
import { WorkplanController } from './workplan.controller';
import { PeriodController } from './controllers/period.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityService } from './services/activity.service';
import { ActivityController } from './controllers/activity.controller';

@Module({
  controllers: [WorkplanController, PeriodController, ActivityController],
  providers: [WorkplanService, PeriodService, ActivityService, PrismaService],
})
export class WorkplanModule {}
