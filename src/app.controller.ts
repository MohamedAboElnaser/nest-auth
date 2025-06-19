import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected-resource')
  @UseGuards(JwtAuthGuard)
  async getProtectedResource(@Request() req) {
    return {
      message: 'You got protected resource',
      'passport-data-injected': req.user,
    };
  }
}
