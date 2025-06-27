import { IsNumber, IsString } from 'class-validator';

export class JwtResponseDto {
  @IsString()
  readonly accessToken: string;

  @IsString()
  readonly refreshToken: string;

  @IsNumber()
  readonly refreshExpiresAt: number;
}
