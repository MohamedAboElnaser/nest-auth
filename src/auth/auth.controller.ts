import { Body, Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { RefreshJwtAuthGuard } from './guards/refresh.guard';

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
  async login(
    @Body() data: LoginDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = this.authService.login(req.user);
    // Return refresh token using Cookies for security wise
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only https in production
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN_DAYS) *
        24 *
        60 *
        60 *
        1000,
    });
    return {
      access_token,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshAccessToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = this.authService.generateTokens(
      req.user.email,
      req.user.userId,
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN_DAYS) *
        24 *
        60 *
        60 *
        1000,
    });

    return {
      access_token,
    };
  }
}
