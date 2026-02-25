import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  RegisterDto,
  ConfirmEmailDto,
  ResendVerificationDto,
  ResendLoginCodeDto,
  LoginDto,
  LoginVerifyDto,
} from '../dto';
import { AuthSwagger } from '../../../swagger/auth.swagger';
import { ResponseHelper } from '../../../common';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return ResponseHelper.success(
      result,
      'If an account exists, login code has been sent to your email',
    );
  }

  @Post('login/resend-code')
  @HttpCode(HttpStatus.OK)
  async resendLoginCode(@Body() dto: ResendLoginCodeDto) {
    const result = await this.authService.resendLoginCode(dto);
    return ResponseHelper.success(
      result,
      'If an account exists, login code has been sent to your email',
    );
  }

  @Post('login/verify')
  @HttpCode(HttpStatus.OK)
  async loginVerify(@Body() dto: LoginVerifyDto) {
    const result = await this.authService.loginVerify(dto);
    return ResponseHelper.success(result, 'Login successful');
  }

  @Get('google/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: { user: LoginDto }) {
    const user = req.user;
    return ResponseHelper.success(
      user,
      'Google login successful',
  );
  }
}
