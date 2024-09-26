import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkplanService } from './services/workplan.service';
import { CreateWorkplanDto } from './dto/create-workplan.dto';
import { UpdateWorkplanDto } from './dto/update-workplan.dto';

@Controller('workplan')
export class WorkplanController {
  constructor(private readonly workplanService: WorkplanService) {}

  @Post()
  create(@Body() createWorkplanDto: CreateWorkplanDto) {
    return this.workplanService.create(createWorkplanDto);
  }

  @Get()
  findAll() {
    return this.workplanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workplanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkplanDto: UpdateWorkplanDto) {
    return this.workplanService.update(+id, updateWorkplanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workplanService.remove(+id);
  }
}
