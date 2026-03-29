import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ValidationError } from '../middlewares/error';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        throw new ValidationError('Username, password and role are required');
      }

      if (role !== 'admin' && role !== 'miniprogram') {
        throw new ValidationError('Role must be admin or miniprogram');
      }

      const result = await authService.login(username, password, role);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const creator = (req as any).user?.userId;

      const result = await authService.register(username, email, password, creator);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();