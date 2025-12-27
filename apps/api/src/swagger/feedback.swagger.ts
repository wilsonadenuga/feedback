import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateFeedbackResponseDto,
  GetFeedbackResponseDto,
  GetFeedbacksResponseDto,
} from '../modules/feedbacks/dto';

export class FeedbackSwagger {
  static create() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create a new feedback',
        description:
          'Creates a new feedback for a project. Optionally assign categories.',
      }),
      ApiOkResponse({
        description: 'Feedback created successfully',
        type: CreateFeedbackResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
    );
  }

  static findOne() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get feedback by ID',
        description: 'Returns feedback details with associated categories',
      }),
      ApiOkResponse({
        description: 'Feedback retrieved successfully',
        type: GetFeedbackResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Feedback not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this feedback',
      }),
    );
  }

  static findMany() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get all feedbacks for a project',
        description:
          'Returns paginated list of feedbacks with filtering and search capabilities',
      }),
      ApiOkResponse({
        description: 'Feedbacks retrieved successfully',
        type: GetFeedbacksResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this project',
      }),
    );
  }
}
