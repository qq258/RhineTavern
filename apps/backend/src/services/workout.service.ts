import prisma from '../config/prisma';
import { ValidationError, NotFoundError, ForbiddenError } from '../middlewares/error';
import { addDeletedFilter, softDelete } from '../utils/soft-delete';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export class WorkoutLogService {
  private checkSevenDayWindow(recordDate: Date): void {
    const now = Date.now();
    const recordTime = recordDate.getTime();
    if (now - recordTime > SEVEN_DAYS_MS) {
      throw new ForbiddenError('Workout log can only be modified/deleted within 7 days');
    }
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    recordDate?: string;
  }) {
    const { page = 1, pageSize = 20, recordDate } = params;
    const skip = (page - 1) * pageSize;

    const where = addDeletedFilter({});
    if (recordDate) {
      where.recordDate = new Date(recordDate);
    }

    const [data, total] = await Promise.all([
      prisma.workoutLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { recordDate: 'desc' },
        include: {
          workoutSets: {
            include: { exercise: true },
            orderBy: { setIndex: 'asc' },
          },
        },
      }),
      prisma.workoutLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string, includeSets = true) {
    const log = await prisma.workoutLog.findFirst({
      where: addDeletedFilter({ id }),
      include: includeSets ? {
        workoutSets: {
          include: { exercise: true },
          orderBy: { setIndex: 'asc' },
        },
      } : undefined,
    });
    if (!log) {
      throw new NotFoundError('WorkoutLog not found');
    }
    return log;
  }

  async create(data: {
    recordDate: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
    sets?: Array<{
      exerciseId: string;
      setIndex: number;
      weightKg: number;
      reps: number;
    }>;
    creator?: string;
  }) {
    if (!data.recordDate) {
      throw new ValidationError('recordDate is required');
    }

    const recordDate = new Date(data.recordDate);
    this.checkSevenDayWindow(recordDate);

    return prisma.workoutLog.create({
      data: {
        recordDate,
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        notes: data.notes,
        creator: data.creator,
        updater: data.creator,
        workoutSets: data.sets ? {
          create: data.sets.map((set) => ({
            exerciseId: set.exerciseId,
            setIndex: set.setIndex,
            weightKg: String(set.weightKg),
            reps: set.reps,
            creator: data.creator,
            updater: data.creator,
          })),
        } : undefined,
      },
      include: {
        workoutSets: {
          include: { exercise: true },
          orderBy: { setIndex: 'asc' },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      startTime?: string;
      endTime?: string;
      notes?: string;
      sets?: Array<{
        exerciseId: string;
        setIndex: number;
        weightKg: number;
        reps: number;
      }>;
      updater?: string;
    }
  ) {
    const log = await this.findById(id);
    this.checkSevenDayWindow(log.recordDate);

    return prisma.workoutLog.update({
      where: { id },
      data: {
        startTime: data.startTime ? new Date(data.startTime) : log.startTime,
        endTime: data.endTime !== undefined ? (data.endTime ? new Date(data.endTime) : null) : log.endTime,
        notes: data.notes !== undefined ? data.notes : log.notes,
        updater: data.updater,
        workoutSets: data.sets ? {
          deleteMany: { workoutLogId: id },
          create: data.sets.map((set) => ({
            exerciseId: set.exerciseId,
            setIndex: set.setIndex,
            weightKg: String(set.weightKg),
            reps: set.reps,
            updater: data.updater,
          })),
        } : undefined,
      },
      include: {
        workoutSets: {
          include: { exercise: true },
          orderBy: { setIndex: 'asc' },
        },
      },
    });
  }

  async delete(id: string, returnDraft = false, updater?: string) {
    const log = await this.findById(id);
    this.checkSevenDayWindow(log.recordDate);

    if (returnDraft) {
      await softDelete(prisma.workoutLog, {
        where: { id },
        data: { updater },
      });
      return log;
    }

    await softDelete(prisma.workoutLog, {
      where: { id },
      data: { updater },
    });
    return null;
  }
}

export default new WorkoutLogService();