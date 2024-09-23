import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: createUserDto
      });
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        if(error.code === "P2002") {
          throw new ConflictException(`User with username: ${createUserDto.username} or email: ${createUserDto.email} 
            already exists`);
        }
      }

      throw new InternalServerErrorException()
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    const userfound = await this.prismaService.user.findUnique({
      where: { id }
    });

    if(!userfound) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return userfound;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userUpdated = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto
    })

    if(!userUpdated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    return userUpdated;
  }

  async remove(id: number) {
    const deletedUser = await this.prismaService.user.delete({
      where: { id }
    });

    if(!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return deletedUser;
  }
}
