import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { GoogleUser } from './interfaces/google-user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: RegisterDto): Promise<User> {
    return await new this.userModel({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    }).save();
  }

  async isUserExist(query: FilterQuery<User>): Promise<boolean> {
    const userExists = await this.userModel.exists(query);
    return !!userExists; // Return true if user exists, otherwise false
  }

  async getUserDocument(query: FilterQuery<User>) {
    return await this.userModel.findOne(query).lean();
  }

  async createGoogleUser(userData: GoogleUser) {
    return await new this.userModel(userData).save();
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).select('-password -__v');
  }
}
