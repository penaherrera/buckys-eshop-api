import {
  Controller,
  NotImplementedException,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PassportLocalGuard } from '../guards/passport-local.guard';
import { CreateUserDto } from '../../users/dtos/requests/create-user.dto';
import { JwtResponseDto } from '../dtos/responses/jwt-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(@Request() request): Promise<JwtResponseDto> {
    return this.authService.logIn(request.user);
  }

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('refresh')
  refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<JwtResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }
}
