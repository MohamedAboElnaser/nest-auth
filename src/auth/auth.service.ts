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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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

  login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
