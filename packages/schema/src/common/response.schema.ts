// Re-export success response types
export * from './success-response.schema';
// Re-export error response types
export * from './error-response.schema';

// Union type for any API response
export type ApiResponse<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; errors?: Array<{ field: string; message: string }>; data: null };
