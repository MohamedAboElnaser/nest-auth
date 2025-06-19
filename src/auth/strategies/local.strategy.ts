import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.verifyUser({ email, password });
      return user; // Passport will attach this to req.user so i can extract it in rout handlers
    } catch (error) {
      // Passport expects null/false for failed authentication
      return null;
    }
  }
}
