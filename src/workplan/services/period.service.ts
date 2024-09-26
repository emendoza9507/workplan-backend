import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePeriodDto } from '../dto/period/create-period.dto';
import { UpdatePeriodDto } from '../dto/period/update-period.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PeriodService {
  constructor(private prismaService: PrismaService) {}

  async create(createPeriodDto: CreatePeriodDto) {
    try {
      return await this.prismaService.period.create({
        data: createPeriodDto
      });
    } catch(error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        if(error.code === "P2002") {
          throw new ConflictException(`Period with name: ${createPeriodDto.name} already exists`);
        }
      }

      throw new InternalServerErrorException()
    }
  }

  findAll() {
    return this.prismaService.period.findMany();
  }

  async findOne(id: number) {
    const periodFound = await this.prismaService.period.findUnique({
      where: { id }
    });

    if(!periodFound) {
      throw new NotFoundException(`Period with id: ${id} not found`);
    }

    return periodFound;
  }

  async update(id: number, updatePeriodDto: UpdatePeriodDto) {
    const periodUpdated = await this.prismaService.period.update({
      where: { id },
      data: updatePeriodDto
    })

    if(!periodUpdated) {
      throw new NotFoundException(`Period with id ${id} not found`)
    }

    return periodUpdated;
  }

  async remove(id: number) {
    const deletedPeriod = await this.prismaService.period.delete({
      where: { id }
    })

    if(!deletedPeriod) {
      throw new NotFoundException(`Period with id ${id} not found`)
    }

    return deletedPeriod;
  }
}
