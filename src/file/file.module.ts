import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

@Module({
    providers: [ PrismaService, FileService ],
    controllers: [ FileController ]
})
export class FileModule {

}