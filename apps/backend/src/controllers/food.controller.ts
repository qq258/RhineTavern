import { Request, Response, NextFunction } from 'express';
import foodService from '../services/food.service';

export class FoodController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, name, category } = req.query;
      const result = await foodService.findAll({
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
        name: name as string,
        category: category as string,
      });
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await foodService.findById(id);
      res.success(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const creator = (req as any).user?.userId;
      const data = await foodService.create({ ...req.body, creator });
      res.success(data, 'Food created successfully');
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updater = (req as any).user?.userId;
      const data = await foodService.update(id, { ...req.body, updater });
      res.success(data, 'Food updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updater = (req as any).user?.userId;
      await foodService.delete(id, updater);
      res.success(null, 'Food deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export default new FoodController();