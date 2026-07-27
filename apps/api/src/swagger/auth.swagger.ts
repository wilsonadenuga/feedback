import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import {
  RegisterResponseDto,
  ConfirmEmailResponseDto,
  ResendVerificationResponseDto,
  GoogleAuthResponseDto,
} from '../modules/auth/dto';

export class AuthSwagger {
  static register() {
    return applyDecorators(
      ApiOperation({
        summary: 'Register a new user and send verification code',
      }),
      ApiOkResponse({
        description: 'Verification code sent successfully',
        type: RegisterResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User already exists',
      }),
    );
  }

  static verifyEmail() {
    return applyDecorators(
      ApiOperation({
        summary: 'Verify email with code and complete registration',
      }),
      ApiOkResponse({
        description: 'Email verified and user logged in',
        type: ConfirmEmailResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or expired code',
      }),
    );
  }

  static resendVerification() {
    return applyDecorators(
      ApiOperation({
        summary: 'Resend verification code to email',
      }),
      ApiOkResponse({
        description: 'Verification code sent successfully',
        type: ResendVerificationResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email already verified',
      }),
    );
  }

  static googleLogin() {
    return applyDecorators(
      ApiOperation({
        summary: 'Initiate Google OAuth login',
      }),
      ApiResponse({
        status: HttpStatus.FOUND,
        description: 'Redirect to Google OAuth',
      }),
    );
  }

  static googleAuthCallback() {
    return applyDecorators(
      ApiOperation({
        summary: 'Google OAuth callback - completes authentication',
      }),
      ApiOkResponse({
        description: 'User logged in successfully with Google',
        type: GoogleAuthResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Google authentication failed',
      }),
    );
  }
}
