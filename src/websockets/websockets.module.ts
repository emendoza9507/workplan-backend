import { Module } from "@nestjs/common";
import { WebsocketGateway } from "./websockets.gateway";
import { UsersModule } from "src/users/users.module";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    providers: [WebsocketGateway, PrismaService, JwtService]
})
export class SocketModule {}