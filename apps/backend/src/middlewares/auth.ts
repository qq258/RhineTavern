import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './error';

const JWT_SECRET = process.env.JWT_SECRET || 'rhine-tavern-secret-key';
const ADMIN_EXPIRES_IN = '1h';
const MINIPROGRAM_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  username: string;
  role: 'admin' | 'miniprogram';
}

export const generateToken = (payload: TokenPayload): string => {
  const expiresIn = payload.role === 'admin' ? ADMIN_EXPIRES_IN : MINIPROGRAM_EXPIRES_IN;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const extractToken = (req: Request): string => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }
  return authHeader.slice(7);
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(err);
    }
  }
};

export const requireRole = (role: 'admin' | 'miniprogram' | 'both') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as TokenPayload;
    if (!user) {
      return next(new UnauthorizedError('Not authenticated'));
    }
    if (role !== 'both' && user.role !== role) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }
    next();
  };
};