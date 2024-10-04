import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './services/chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post()
    @ApiOperation({ summary: 'Create a Chat' })
    async create(@Body() createUserDto: CreateChatDto) {
        let chat: any = await this.chatService.findOne(createUserDto.participants)

        if(!chat) {
            chat = await this.chatService.create(createUserDto)
        }

        return chat;
    }

    @Get(':chatId')
    async findOne(@Param('chatId') chatId: number, @Query('page') page: number) {
        return await this.chatService.findById(+chatId, page);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Return all chats' })
    findAll() {
        return this.chatService.findAll();
    }
}
