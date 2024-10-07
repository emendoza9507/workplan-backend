import { Injectable, NotFoundException } from "@nestjs/common";
import { File } from "@prisma/client";
import { join } from "path";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FileService {
    constructor(private prismaService: PrismaService) {}

    async uploadFile(messageId: number, file: Express.Multer.File) {
        const message = await this.prismaService.message.findUnique({
            where:  { id: messageId }
        });

        if(!message) {
            throw new NotFoundException('Mensage no encontrado');
        }

        const newFile = await this.prismaService.file.create({
            data: {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                message: {
                    connect: message
                }
            },
            include: {
                message: true
            }
        });

        return newFile;
    }   

    async downloadFile(fileId: number): Promise<File> {
        const file = await this.prismaService.file.findUnique({where: { id: fileId }});

        if(!file) {
            throw new NotFoundException('Archivo no encontrado');
        }

        return file;
    }

    getFilePath(file: File): string {
        return join(__dirname, '..', '..', file.path)
    }

}