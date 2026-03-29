import prisma from '../config/prisma';
import { ValidationError, RateLimitError, NotFoundError } from '../middlewares/error';
import { addDeletedFilter, softDelete } from '../utils/soft-delete';

export class ExerciseService {
  async findAll(params: {
    page?: number;
    pageSize?: number;
    name?: string;
    targetMuscle?: string;
  }) {
    const { page = 1, pageSize = 20, name, targetMuscle } = params;
    const skip = (page - 1) * pageSize;

    const where = addDeletedFilter({});
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (targetMuscle) {
      where.targetMuscle = targetMuscle;
    }

    if (!params.page && !params.pageSize) {
      const count = await prisma.exercise.count({ where });
      if (count > 2000) {
        throw new RateLimitError('Data exceeds 2000 records, pagination required');
      }
    }

    const [data, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createDate: 'desc' },
      }),
      prisma.exercise.count({ where }),
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
    const exercise = await prisma.exercise.findFirst({
      where: addDeletedFilter({ id }),
    });
    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }
    return exercise;
  }

  async create(data: {
    name: string;
    targetMuscle: string;
    equipment?: string;
    notes?: string;
    creator?: string;
  }) {
    if (!data.name || !data.targetMuscle) {
      throw new ValidationError('Name and targetMuscle are required');
    }

    return prisma.exercise.create({
      data: {
        name: data.name,
        targetMuscle: data.targetMuscle,
        equipment: data.equipment,
        notes: data.notes,
        creator: data.creator,
        updater: data.creator,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      targetMuscle?: string;
      equipment?: string;
      notes?: string;
      updater?: string;
    }
  ) {
    await this.findById(id);

    return prisma.exercise.update({
      where: { id },
      data: {
        name: data.name,
        targetMuscle: data.targetMuscle,
        equipment: data.equipment,
        notes: data.notes,
        updater: data.updater,
      },
    });
  }

  async delete(id: string, updater?: string) {
    await this.findById(id);
    return softDelete(prisma.exercise, {
      where: { id },
      data: { updater },
    });
  }
}

export default new ExerciseService();