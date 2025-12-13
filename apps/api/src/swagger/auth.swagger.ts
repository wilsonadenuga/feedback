import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { RegisterResponseDto, ConfirmEmailResponseDto } from 'modules/auth/dto';

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
}
