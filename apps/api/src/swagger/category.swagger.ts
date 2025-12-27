import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CategoryResponseDto,
  CategoryDeleteResponseDto,
  GetCategoryResponseDto,
  GetCategoriesResponseDto,
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
        type: GetCategoryResponseDto,
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
        type: GetCategoryResponseDto,
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
        type: GetCategoryResponseDto,
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

  static findAll() {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get all categories by project',
        description:
          'Returns all categories within the specified project. Requires project_id as query parameter.',
      }),
      ApiQuery({
        name: 'project_id',
        required: true,
        description: 'The ID of the project to get categories for',
        type: String,
      }),
      ApiOkResponse({
        description: 'Categories retrieved successfully',
        type: GetCategoriesResponseDto,
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid project_id',
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Invalid or missing token',
      }),
    );
  }
}
