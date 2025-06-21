import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    });
  }
  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && 'refresh_token' in req.cookies)
      return req.cookies.refresh_token;
    return null;
  }

  validate(req: Request, payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
