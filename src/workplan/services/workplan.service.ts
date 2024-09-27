import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWorkplanDto } from '../dto/create-workplan.dto';
import { UpdateWorkplanDto } from '../dto/update-workplan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkplanService {
  constructor(private prismaService: PrismaService) {}

  async create(createWorkplanDto: CreateWorkplanDto) {
    try {
      return await this.prismaService.workPlan.create({
        data: createWorkplanDto
      })
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        if(error.code === 'P2002') {
          throw new ConflictException(`WorkPlan with that data already exists`);
        }
      }

      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.workPlan.findMany({
      include: {
        author: true,
        period: true,
        activites: true
      }
    });
  }

  async findOne(id: number) {
    const workplanFound = await this.prismaService.workPlan.findUnique({
      where: { id },
      include: {
        author: true,
        period: true,
        activites: true
      }
    })

    if(!workplanFound) {
      throw new NotFoundException(`WorkPlan with id:${id} not found`);
    }

    return workplanFound
  }

  async update(id: number, updateWorkplanDto: UpdateWorkplanDto) {
    const updatedWorkPlan = await this.prismaService.workPlan.update({
      where: { id },
      data: updateWorkplanDto
    });

    if(!updatedWorkPlan) {
      throw new NotFoundException(`WorkPlan with id:${id} not found`);
    }

    return updatedWorkPlan;
  }

  async remove(id: number) {
    const deletedWorkPlan = await this.prismaService.workPlan.delete({
      where: { id }
    });

    if(!deletedWorkPlan) {
      throw new NotFoundException(`WorkPlan with id:${id} not found`);
    }

    return deletedWorkPlan;
  }
}
