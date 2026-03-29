import { User } from '@prisma/client';
import prisma from '../config/prisma';
import { generateToken, TokenPayload } from '../middlewares/auth';
import { ValidationError, UnauthorizedError } from '../middlewares/error';
import { addDeletedFilter } from '../utils/soft-delete';
import bcrypt from 'bcrypt';

export class AuthService {
  async login(username: string, password: string, role: 'admin' | 'miniprogram'): Promise<{ token: string; user: any }> {
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    const where = addDeletedFilter({ username });
    const user = await prisma.user.findFirst({ where });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (role === 'admin' && !user.lastLogin) {
      const isFirstAdmin = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM sys_users WHERE deleted = false
      `.then(r => Number(r[0].count) === 1);
      if (!isFirstAdmin) {
        throw new UnauthorizedError('Admin login not allowed via miniprogram endpoint');
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is inactive');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload: TokenPayload = {
      userId: user.id,
      username: user.username,
      role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(
    username: string,
    email: string,
    password: string,
    creator?: string
  ): Promise<{ user: any }> {
    if (!username || !email || !password) {
      throw new ValidationError('Username, email and password are required');
    }

    const existingUser = await prisma.user.findFirst({
      where: addDeletedFilter({
        OR: [{ username }, { email }],
      }),
    });

    if (existingUser) {
      throw new ValidationError('Username or email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      } as any,
    });

    if (creator) {
      await prisma.user.update({
        where: { id: user.id },
        data: { creator, updater: creator },
      });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}

export default new AuthService();