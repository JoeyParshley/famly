import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { User } from './entities/user.entity';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
        const user = await this.authService.register(
            registerDto.email,
            registerDto.password,
            registerDto.name,
        );
        // Exclude passwordHash from response
        const { passwordHash, ...result } = user;
        return result;
    }

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return await this.authService.login(loginDto.email, loginDto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req): Omit<User, 'passwordHash'> {
        const user = req.user as User;
        // Exclude passwordHash from response
        const { passwordHash, ...result } = user;
        return result;
    }
}
