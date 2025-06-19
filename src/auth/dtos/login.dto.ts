import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @Length(8, 20)
  password: string;
}
