import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEXP } from '../../../common/utils/password-regex';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_REGEXP, {
    message:
      'The password must contain at least one lowercase letter, numbers and one capital letter',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmationPassword: string;
}
