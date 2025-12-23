import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CategoryResponseDto,
  CategoryDeleteResponseDto,
} from '../modules/categories/dto';

export class CategorySwagger {
  static create() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create a new category',
        description:
          'Creates a new category. Provide project_id in the request body.',
      }),
      ApiOkResponse({
        description: 'Category created successfully',
        type: CategoryResponseDto,
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
        summary: 'Get category by ID',
        description: 'Returns category details',
      }),
      ApiOkResponse({
        description: 'Category retrieved successfully',
        type: CategoryResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Category not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this category',
      }),
    );
  }

  static update() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update category',
        description: 'Updates category name',
      }),
      ApiOkResponse({
        description: 'Category updated successfully',
        type: CategoryResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Category not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this category',
      }),
    );
  }

  static delete() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete category',
        description: 'Permanently deletes the category',
      }),
      ApiOkResponse({
        description: 'Category deleted successfully',
        type: CategoryDeleteResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Category not found',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'You do not have access to this category',
      }),
    );
  }

  static getProjectCategories() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get all categories in project',
        description: 'Returns all categories within the specified project',
      }),
      ApiOkResponse({
        description: 'Categories retrieved successfully',
        type: CategoryResponseDto,
        isArray: true,
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
}
