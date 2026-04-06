import { IsEmail, IsNotEmpty } from 'class-validator';

export class DemoLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
