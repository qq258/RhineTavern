import prisma from '../config/prisma';
import { ValidationError, NotFoundError } from '../middlewares/error';
import { addDeletedFilter, softDelete } from '../utils/soft-delete';

export class DietLogService {
  async findAll(params: {
    page?: number;
    pageSize?: number;
    recordDate?: string;
    mealType?: string;
    foodId?: string;
  }) {
    const { page = 1, pageSize = 20, recordDate, mealType, foodId } = params;
    const skip = (page - 1) * pageSize;

    const where = addDeletedFilter({});
    if (recordDate) {
      where.recordDate = new Date(recordDate);
    }
    if (mealType) {
      where.mealType = mealType;
    }
    if (foodId) {
      where.foodId = foodId;
    }

    const [data, total] = await Promise.all([
      prisma.dietLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { recordDate: 'desc' },
        include: { food: true },
      }),
      prisma.dietLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string) {
    const log = await prisma.dietLog.findFirst({
      where: addDeletedFilter({ id }),
      include: { food: true },
    });
    if (!log) {
      throw new NotFoundError('DietLog not found');
    }
    return log;
  }

  async create(data: {
    recordDate: string;
    mealType: string;
    foodId: string;
    weightG: number;
    creator?: string;
  }) {
    if (!data.recordDate || !data.mealType || !data.foodId || !data.weightG) {
      throw new ValidationError('recordDate, mealType, foodId and weightG are required');
    }

    const food = await prisma.food.findFirst({
      where: addDeletedFilter({ id: data.foodId }),
    });
    if (!food) {
      throw new NotFoundError('Food not found');
    }

    const weightFactor = data.weightG / 100;
    const totalKcal = Number(food.kcalPer100g) * weightFactor;
    const totalProtein = Number(food.proteinPer100g) * weightFactor;
    const totalCarbs = Number(food.carbsPer100g) * weightFactor;
    const totalFat = Number(food.fatPer100g) * weightFactor;

    return prisma.dietLog.create({
      data: {
        recordDate: new Date(data.recordDate),
        mealType: data.mealType,
        foodId: data.foodId,
        weightG: String(data.weightG),
        totalKcal: String(totalKcal.toFixed(2)),
        totalProtein: String(totalProtein.toFixed(2)),
        totalCarbs: String(totalCarbs.toFixed(2)),
        totalFat: String(totalFat.toFixed(2)),
        creator: data.creator,
        updater: data.creator,
      },
      include: { food: true },
    });
  }

  async delete(id: string, updater?: string) {
    await this.findById(id);
    return softDelete(prisma.dietLog, {
      where: { id },
      data: { updater },
    });
  }
}

export default new DietLogService();