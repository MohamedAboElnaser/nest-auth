import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //register
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return await this.authService.register(registerData);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() data: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }
}
