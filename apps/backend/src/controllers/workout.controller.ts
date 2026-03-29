import { Request, Response, NextFunction } from 'express';
import workoutLogService from '../services/workout.service';

export class WorkoutLogController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, recordDate } = req.query;
      const result = await workoutLogService.findAll({
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
        recordDate: recordDate as string,
      });
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await workoutLogService.findById(id);
      res.success(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const creator = (req as any).user?.userId;
      const data = await workoutLogService.create({ ...req.body, creator });
      res.success(data, 'Workout log created successfully');
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updater = (req as any).user?.userId;
      const data = await workoutLogService.update(id, { ...req.body, updater });
      res.success(data, 'Workout log updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const returnDraft = req.query.returnDraft === 'true';
      const updater = (req as any).user?.userId;
      const data = await workoutLogService.delete(id, returnDraft, updater);
      res.success(data, 'Workout log deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export default new WorkoutLogController();