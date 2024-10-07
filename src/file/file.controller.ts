import { Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { v4 as uuidv4 } from 'uuid'
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Response } from "express";

@Controller('messages')
export class FileController {   
    constructor( private readonly fileService: FileService ) {}

    @Post(':id/file')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const filename = `${uuidv4()}-${file.originalname}`;
                    cb(null, filename);
                }
            })
        })
    )
    async uploadFile(
        @Param('id') messageId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.fileService.uploadFile(+messageId, file)
    }

    @Get(':id/file')
    async downloadFile(
        @Param('fileId') fileId: string,
        @Res() res: Response
    ) {
        const file = await this.fileService.downloadFile(+fileId);
        if(!file) {
            throw new NotFoundException('Archivo no encontrado');
        }
        
        res.sendFile(this.fileService.getFilePath(file));
    }
}