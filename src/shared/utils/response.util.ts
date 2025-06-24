export interface ApiRResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export function createResponse<T>(
  status: 'success' | 'error',
  message: string,
  data?: T,
): ApiRResponse<T> {
  return {
    status,
    message,
    data,
  };
}
