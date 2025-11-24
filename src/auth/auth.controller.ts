import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
       @Body() LoginDto: LoginDto,
    ): Promise<AuthResponseDto> {
        return this.authService.signIn(LoginDto.username, LoginDto.password);
    }
    
}

