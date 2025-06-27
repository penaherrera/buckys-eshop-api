import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { PASSWORD_REGEXP } from '../../../common/utils/password-regex';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @Matches(PASSWORD_REGEXP, {
    message:
      'The password must contain at least one lowercase letter, numbers and one capital letter',
  })
  password: string;
}
