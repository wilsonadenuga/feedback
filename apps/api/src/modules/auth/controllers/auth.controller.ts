import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto, VerifyEmailDto } from '../dto';
import { AuthSwagger } from '../../../swagger/auth.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.register()
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.verifyEmail()
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyCode(dto);
  }
}
