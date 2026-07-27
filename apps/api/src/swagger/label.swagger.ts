import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  LabelDeleteResponseDto,
  GetLabelResponseDto,
  GetLabelsResponseDto,
} from '../modules/labels/dto';

export class LabelSwagger {
  static create() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create a new label',
        description:
          'Creates a new label. Provide workspace_id in the request body.',
      }),
      ApiOkResponse({
        description: 'Label created successfully',
        type: GetLabelResponseDto,
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
        summary: 'Get label by ID',
        description: 'Returns label details',
      }),
      ApiOkResponse({
        description: 'Label retrieved successfully',
        type: GetLabelResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Label not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this label',
      }),
    );
  }

  static update() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update label',
        description: 'Updates label name, description, and color',
      }),
      ApiOkResponse({
        description: 'Label updated successfully',
        type: GetLabelResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Label not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this label',
      }),
    );
  }

  static delete() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete label',
        description: 'Permanently deletes the label',
      }),
      ApiOkResponse({
        description: 'Label deleted successfully',
        type: LabelDeleteResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Label not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this label',
      }),
    );
  }

  static findAll() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get all labels in a workspace',
        description:
          'Returns all labels within the specified workspace. Requires workspace_id as query parameter.',
      }),
      ApiQuery({
        name: 'workspace_id',
        required: true,
        description: 'The ID of the workspace to get labels for',
        type: String,
      }),
      ApiOkResponse({
        description: 'Labels retrieved successfully',
        type: GetLabelsResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid workspace_id',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
    );
  }
}
