import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(username: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findByUsername(username);

        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }

        const { password, ...result } = user

        const payload = { sub: user.id, ...result };

        const token = await this.jwtService.signAsync(payload, {expiresIn: '9999 years'});

        return {
            access_token: token,
            ...result
        };
    }

    async signUp(signUpDto: SignUpDto) {
        const userExist = await this.usersService.findByUsernameOrEmail(signUpDto);

        if (userExist) {
            throw new ConflictException('Ya existe un usuario con estos datos')
        }

        try {
            return await this.usersService.create(signUpDto as CreateUserDto);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ConflictException(`User with username: ${signUpDto.username} or email: ${signUpDto.email} 
                    already exists`);
                }
            }

            throw new InternalServerErrorException()
        }
    }
}
