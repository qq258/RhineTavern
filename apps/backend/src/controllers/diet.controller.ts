import { Request, Response, NextFunction } from 'express';
import dietLogService from '../services/diet.service';

export class DietLogController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, recordDate, mealType, foodId } = req.query;
      const result = await dietLogService.findAll({
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
        recordDate: recordDate as string,
        mealType: mealType as string,
        foodId: foodId as string,
      });
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await dietLogService.findById(id);
      res.success(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const creator = (req as any).user?.userId;
      const data = await dietLogService.create({ ...req.body, creator });
      res.success(data, 'Diet log created successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updater = (req as any).user?.userId;
      await dietLogService.delete(id, updater);
      res.success(null, 'Diet log deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export default new DietLogController();