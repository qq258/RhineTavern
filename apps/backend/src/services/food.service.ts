import prisma from '../config/prisma';
import { ValidationError, RateLimitError, NotFoundError } from '../middlewares/error';
import { addDeletedFilter, softDelete } from '../utils/soft-delete';

export class FoodService {
  async findAll(params: {
    page?: number;
    pageSize?: number;
    name?: string;
    category?: string;
  }) {
    const { page = 1, pageSize = 20, name, category } = params;
    const skip = (page - 1) * pageSize;

    const where = addDeletedFilter({});
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (category) {
      where.category = category;
    }

    if (!params.page && !params.pageSize) {
      const count = await prisma.food.count({ where });
      if (count > 2000) {
        throw new RateLimitError('Data exceeds 2000 records, pagination required');
      }
    }

    const [data, total] = await Promise.all([
      prisma.food.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createDate: 'desc' },
      }),
      prisma.food.count({ where }),
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
    const food = await prisma.food.findFirst({
      where: addDeletedFilter({ id }),
    });
    if (!food) {
      throw new NotFoundError('Food not found');
    }
    return food;
  }

  async create(data: {
    name: string;
    category?: string;
    kcalPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    creator?: string;
  }) {
    if (!data.name || data.kcalPer100g === undefined) {
      throw new ValidationError('Name and kcalPer100g are required');
    }

    return prisma.food.create({
      data: {
        name: data.name,
        category: data.category,
        kcalPer100g: String(data.kcalPer100g),
        proteinPer100g: String(data.proteinPer100g),
        carbsPer100g: String(data.carbsPer100g),
        fatPer100g: String(data.fatPer100g),
        creator: data.creator,
        updater: data.creator,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      category?: string;
      kcalPer100g?: number;
      proteinPer100g?: number;
      carbsPer100g?: number;
      fatPer100g?: number;
      updater?: string;
    }
  ) {
    const food = await this.findById(id);

    return prisma.food.update({
      where: { id },
      data: {
        name: data.name ?? food.name,
        category: data.category ?? food.category,
        kcalPer100g: data.kcalPer100g !== undefined ? String(data.kcalPer100g) : food.kcalPer100g,
        proteinPer100g: data.proteinPer100g !== undefined ? String(data.proteinPer100g) : food.proteinPer100g,
        carbsPer100g: data.carbsPer100g !== undefined ? String(data.carbsPer100g) : food.carbsPer100g,
        fatPer100g: data.fatPer100g !== undefined ? String(data.fatPer100g) : food.fatPer100g,
        updater: data.updater,
      },
    });
  }

  async delete(id: string, updater?: string) {
    await this.findById(id);
    return softDelete(prisma.food, {
      where: { id },
      data: { updater },
    });
  }
}

export default new FoodService();