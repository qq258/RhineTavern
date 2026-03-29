import { Request, Response, NextFunction } from 'express';

export class BusinessError extends Error {
  constructor(
    public code: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

export class ValidationError extends BusinessError {
  constructor(message: string, details?: any) {
    super(40000, message, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends BusinessError {
  constructor(message = '未授权', details?: any) {
    super(40100, message, details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends BusinessError {
  constructor(message = '禁止访问', details?: any) {
    super(40300, message, details);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends BusinessError {
  constructor(message = '资源不存在', details?: any) {
    super(40400, message, details);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends BusinessError {
  constructor(message = '请求过于频繁', details?: any) {
    super(42901, message, details);
    this.name = 'RateLimitError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]', err);

  if (err instanceof BusinessError) {
    return res.status(200).json({
      success: false,
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(200).json({
      success: false,
      code: 40000,
      message: '请求体解析失败',
    });
  }

  return res.status(200).json({
    success: false,
    code: 50000,
    message: '服务器内部错误',
  });
};