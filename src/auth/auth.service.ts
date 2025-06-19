import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
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
}
