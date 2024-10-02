import { Module } from "@nestjs/common";
import { WebsocketGateway } from "./websockets.gateway";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ChatModule } from "src/chat/chat.module";

@Module({
    imports: [ ChatModule ],
    providers: [WebsocketGateway, PrismaService, JwtService]
})
export class SocketModule {}