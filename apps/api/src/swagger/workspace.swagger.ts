import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  WorkspaceResponseDto,
  WorkspacesResponseDto,
  WorkspaceDeleteResponseDto,
} from '../modules/workspace/dto';

export class WorkspaceSwagger {
  static create() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create a new workspace',
        description:
          'Creates a new workspace and automatically adds the creator as a member with admin role',
      }),
      ApiOkResponse({
        description: 'Workspace created successfully',
        type: WorkspaceResponseDto,
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

  static findAll() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get all workspaces for current user',
        description:
          'Returns all workspaces where the user is either the owner or a member',
      }),
      ApiOkResponse({
        description: 'Workspaces retrieved successfully',
        type: WorkspacesResponseDto,
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
        summary: 'Get workspace by ID',
        description: 'Returns workspace details including members',
      }),
      ApiOkResponse({
        description: 'Workspace retrieved successfully',
        type: WorkspaceResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Workspace not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
    );
  }

  static update() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update workspace',
        description: 'Updates workspace name and/or logo',
      }),
      ApiOkResponse({
        description: 'Workspace updated successfully',
        type: WorkspaceResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Workspace not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
    );
  }

  static delete() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete workspace',
        description:
          'Permanently deletes the workspace and all associated data',
      }),
      ApiOkResponse({
        description: 'Workspace deleted successfully',
        type: WorkspaceDeleteResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Workspace not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
    );
  }
}
