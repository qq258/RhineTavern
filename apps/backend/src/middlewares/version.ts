import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './error';

const SUPPORTED_VERSIONS = ['1.0.0'];

export const versionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const version = req.headers['x-api-version'] as string;

  if (!version) {
    return next(new ValidationError('Missing X-API-Version header'));
  }

  if (!SUPPORTED_VERSIONS.includes(version)) {
    return next(
      new ValidationError(`Unsupported API version: ${version}. Supported: ${SUPPORTED_VERSIONS.join(', ')}`)
    );
  }

  next();
};