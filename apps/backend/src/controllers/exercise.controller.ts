import { Request, Response, NextFunction } from 'express';
import exerciseService from '../services/exercise.service';

export class ExerciseController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, name, targetMuscle } = req.query;
      const result = await exerciseService.findAll({
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
        name: name as string,
        targetMuscle: targetMuscle as string,
      });
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await exerciseService.findById(id);
      res.success(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const creator = (req as any).user?.userId;
      const data = await exerciseService.create({ ...req.body, creator });
      res.success(data, 'Exercise created successfully');
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updater = (req as any).user?.userId;
      const data = await exerciseService.update(id, { ...req.body, updater });
      res.success(data, 'Exercise updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updater = (req as any).user?.userId;
      await exerciseService.delete(id, updater);
      res.success(null, 'Exercise deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export default new ExerciseController();