import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreatePeriodDto } from '../dto/period/create-period.dto';
import { UpdatePeriodDto } from '../dto/period/update-period.dto';
import { PeriodService } from '../services/period.service';

@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodService.create(createPeriodDto);
  }

  @Get()
  findAll() {
    return this.periodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodDto: UpdatePeriodDto) {
    return this.periodService.update(+id, updatePeriodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodService.remove(+id);
  }
}
