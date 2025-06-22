import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserData(@Req() req) {
    return {
      message: 'This the data of the current loged in user',
      user: req.user,
    };
  }
}
