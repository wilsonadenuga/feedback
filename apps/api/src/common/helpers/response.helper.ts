import {
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse,
  PaginationMeta,
  ValidationError,
} from '@feedback/schema';

export class ResponseHelper {
  static success<T>(data: T, message = 'Success'): SuccessResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static paginated<T>(
    items: T[],
    meta: PaginationMeta,
    message = 'Success',
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data: {
        items,
        meta,
      },
    };
  }

  static error(message: string, errors?: ValidationError[]): ErrorResponse {
    return {
      success: false,
      message,
      errors,
      data: null,
    };
  }
}

export function createPaginationMeta(
  page: number,
  per_page: number,
  total: number,
): PaginationMeta {
  return {
    page,
    per_page,
    total,
    total_pages: Math.ceil(total / per_page),
  };
}
