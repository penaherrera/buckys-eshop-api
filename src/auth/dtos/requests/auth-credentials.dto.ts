import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;
}
