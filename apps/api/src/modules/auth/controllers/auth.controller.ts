import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto, ConfirmEmailDto, ResendVerificationDto } from '../dto';
import { AuthSwagger } from '../../../swagger/auth.swagger';
import { ResponseHelper } from '../../../common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.register()
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return ResponseHelper.success(
      result,
      'Verification code sent to your email',
    );
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.verifyEmail()
  async verifyEmail(@Body() dto: ConfirmEmailDto) {
    const result = await this.authService.verifyCode(dto);
    return ResponseHelper.success(result, 'Email verified successfully');
  }

  @Post('resend-verification-email')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.resendVerification()
  async resendVerification(@Body() dto: ResendVerificationDto) {
    const result = await this.authService.resendVerification(dto);
    return ResponseHelper.success(
      result,
      'If an account exists, verification code has been sent',
    );
  }
}
