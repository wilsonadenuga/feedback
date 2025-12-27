import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateProjectResponseDto,
  GetProjectResponseDto,
  GetProjectsResponseDto,
  UpdateProjectResponseDto,
  DeleteProjectResponseDto,
} from '../modules/projects/dto';

export class ProjectSwagger {
  static create() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create a new project',
        description:
          'Creates a new project. Provide workspace_id in the request body.',
      }),
      ApiOkResponse({
        description: 'Project created successfully',
        type: CreateProjectResponseDto,
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
        summary: 'Get project by ID',
        description: 'Returns project details',
      }),
      ApiOkResponse({
        description: 'Project retrieved successfully',
        type: GetProjectResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Project not found',
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

  static update() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update project',
        description: 'Updates project name and/or description',
      }),
      ApiOkResponse({
        description: 'Project updated successfully',
        type: UpdateProjectResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Project not found',
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

  static delete() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete project',
        description: 'Permanently deletes the project and all associated data',
      }),
      ApiOkResponse({
        description: 'Project deleted successfully',
        type: DeleteProjectResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Project not found',
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

  static findAll() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get all projects by workspace',
        description:
          'Returns all projects within the specified workspace. Requires workspace_id as query parameter.',
      }),
      ApiQuery({
        name: 'workspace_id',
        required: true,
        description: 'The ID of the workspace to get projects for',
        type: String,
      }),
      ApiOkResponse({
        description: 'Projects retrieved successfully',
        type: GetProjectsResponseDto,
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
