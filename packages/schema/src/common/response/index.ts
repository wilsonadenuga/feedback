export * from './success-response.schema';
export * from './error-response.schema';


export type ApiResponse<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; errors?: Array<{ field: string; message: string }>; data: null };
