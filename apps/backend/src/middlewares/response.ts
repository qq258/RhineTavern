import { Request, Response, NextFunction } from 'express';

export const responseFormat = (req: Request, res: Response, next: NextFunction) => {
  res.success = <T>(data?: T, message = '操作成功') => {
    res.json({
      success: true,
      code: 20000,
      message,
      data,
    });
  };

  res.error = (message = '操作失败', code = 50000) => {
    res.status(500).json({
      success: false,
      code,
      message,
    });
  };

  next();
};

declare global {
  namespace Express {
    interface Response {
      success: <T>(data?: T, message?: string) => void;
      error: (message?: string, code?: number) => void;
    }
  }
}