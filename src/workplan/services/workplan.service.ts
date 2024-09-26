import { Injectable } from '@nestjs/common';
import { CreateWorkplanDto } from '../dto/create-workplan.dto';
import { UpdateWorkplanDto } from '../dto/update-workplan.dto';

@Injectable()
export class WorkplanService {
  create(createWorkplanDto: CreateWorkplanDto) {
    return 'This action adds a new workplan';
  }

  findAll() {
    return `This action returns all workplan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workplan`;
  }

  update(id: number, updateWorkplanDto: UpdateWorkplanDto) {
    return `This action updates a #${id} workplan`;
  }

  remove(id: number) {
    return `This action removes a #${id} workplan`;
  }
}
