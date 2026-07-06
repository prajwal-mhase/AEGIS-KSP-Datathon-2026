export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export const unauthorized = () => new AppError(401, 'UNAUTHORIZED', 'Authentication is required.');
export const forbidden = () => new AppError(403, 'FORBIDDEN', 'You are not allowed to perform this action.');
