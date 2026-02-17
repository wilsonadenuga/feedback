import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';
import type { ValidationError } from '@feedback/schema';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, errorResponse } = this.handleException(exception);

    response.status(status).json(errorResponse);
  }

  private handleException(exception: unknown) {
    if (exception instanceof ZodValidationException) {
      return this.handleZodValidationError(exception);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    return this.handleUnknownError(exception);
  }

  private handleZodValidationError(exception: ZodValidationException) {
    const zodError = exception.getZodError() as ZodError;

    const errors: ValidationError[] = zodError.issues.map((issue) => ({
      field: issue.path.join('.') || 'unknown',
      message: issue.message,
    }));

    return {
      status: HttpStatus.BAD_REQUEST,
      errorResponse: {
        success: false as const,
        message: 'Validation failed',
        errors,
        data: null,
      },
    };
  }

  private handleHttpException(exception: HttpException) {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message = this.extractMessage(exceptionResponse);
    const errors = this.extractErrors(exceptionResponse);

    return {
      status,
      errorResponse: {
        success: false as const,
        message,
        errors,
        data: null,
      },
    };
  }

  private extractMessage(exceptionResponse: string | object): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if ('message' in exceptionResponse) {
      const msg = exceptionResponse.message;

      if (typeof msg === 'string') {
        return msg;
      }

      if (Array.isArray(msg)) {
        return msg.join(', ');
      }
    }

    return 'Internal server error';
  }

  private extractErrors(
    exceptionResponse: string | object,
  ): ValidationError[] | undefined {
    if (typeof exceptionResponse !== 'object') {
      return undefined;
    }

    if (
      'errors' in exceptionResponse &&
      Array.isArray(exceptionResponse.errors)
    ) {
      return exceptionResponse.errors.map((error: unknown) => {
        if (typeof error !== 'object' || error === null) {
          return {
            field: 'unknown',
            message: 'Validation error',
          };
        }

        const errorRecord = error as Record<string, unknown>;
        const path = errorRecord.path;
        const message = errorRecord.message;

        return {
          field: Array.isArray(path) ? path.join('.') : 'unknown',
          message: typeof message === 'string' ? message : 'Validation error',
        };
      });
    }

    return undefined;
  }

  private handleUnknownError(exception: unknown) {
    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorResponse: {
        success: false as const,
        message,
        data: null,
      },
    };
  }
}
