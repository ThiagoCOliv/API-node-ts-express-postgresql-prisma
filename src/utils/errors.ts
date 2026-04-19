export class AppError extends Error 
{
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) 
  {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError 
{
  constructor(resource: string = 'Resource') { super(`${resource} not found`, 404); }
}

export class ValidationError extends AppError 
{
  constructor(message: string = 'Validation failed') { super(message, 400); }
}

export class ConflictError extends AppError 
{
  constructor(message: string = 'Resource already exists') { super(message, 409); }
}

export class UnauthorizedError extends AppError 
{
  constructor(message: string = 'Unauthorized') { super(message, 401); }
}

export interface ErrorResponse 
{
  success: false;
  error: string;
  code?: string;
}

export interface SuccessResponse<T = any> 
{
  success: true;
  data: T;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}