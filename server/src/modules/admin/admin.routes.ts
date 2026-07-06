import { Router } from 'express';
import { requireAuth, requireRole } from '../../http/auth-context.js';
import { ok } from '../../http/respond.js';
import { prisma } from '../../lib/prisma.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('ADMIN'));

adminRouter.get('/audit-logs', async (_req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { user: { select: { name: true, email: true, role: true } } },
    });
    ok(res, logs);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/users', async (_req, res, next) => {
  try {
    ok(
      res,
      await prisma.user.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, email: true, role: true, district: true, station: true, isActive: true },
      }),
    );
  } catch (error) {
    next(error);
  }
});
