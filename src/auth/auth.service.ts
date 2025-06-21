import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async register(data: RegisterDto) {
    //Make sure the email is unique
    const existingUser = await this.userService.isUserExist({
      email: data.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already used!');
    }

    //Hash password and save the Document to the DB collection
    return await this.userService.create(data);
  }

  async verifyUser(data: LoginDto) {
    // Verify that user exists
    const user = await this.userService.getUserDocument({ email: data.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPassCorrect = await bcrypt.compare(data.password, user.password);

    if (!isPassCorrect) {
      throw new UnauthorizedException('Wrong Password');
    }

    // Return user without password
    const { password, ...result } = user;
    return result;
  }

  login(user: User) {
    return this.generateTokens(user);
  }

  generateTokens(userData: User) {
    const payload = { email: userData.email, sub: userData._id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get<string>('REFRESH_JWT_SECRET'),
      expiresIn: this.config.get<string | number>('REFRESH_JWT_EXPIRES_IN'),
    });
    return {
      access_token,
      refresh_token,
    };
  }
}
