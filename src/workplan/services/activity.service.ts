import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateActivityDto } from "../dto/activity/create-activity.dto";
import { Prisma } from "@prisma/client";
import { UpdateActivityDto } from "../dto/activity/update-activity.dto";

@Injectable()
export class ActivityService {
    constructor( private prismaService: PrismaService ) {}

    async create(createActivityDto: CreateActivityDto) {
        try {
            return await this.prismaService.activity.create({
                data: createActivityDto
            })
        } catch(error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code == 'P2002') {
                    throw new ConflictException(`Activity with this data already exists`)
                }                
            }

            if(error instanceof Prisma.PrismaClientValidationError) {
                throw error
            }

            throw new InternalServerErrorException();
        }
    }

    findAll() {
        return this.prismaService.activity.findMany({
            include: {
                workPlan: true,
                createdByUser: true
            }
        })
    }

    async findOne(id: number) {
        const activityFound = await this.prismaService.activity.findUnique({
            where: { id }
        });

        if(!activityFound) {
            throw new NotFoundException(`Activity with id: ${id} not found`)
        }

        return activityFound
    }

    async update(id: number, updateActivityDto: UpdateActivityDto) {
        const updatedActivity = await this.prismaService.activity.update({
            where: { id },
            data: updateActivityDto
        });

        if(!updatedActivity) {
            throw new NotFoundException(`Activity with id: ${id} not found`);
        }

        return updatedActivity;
    }

    async remove(id: number) {
        const removedActivity = await this.prismaService.activity.delete({
            where: { id }
        });

        if(!removedActivity) {
            throw new NotFoundException(`Activity with id: ${id} not found`);
        }

        return removedActivity;
    }
}