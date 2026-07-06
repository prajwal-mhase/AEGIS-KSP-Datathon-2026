import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../../http/auth-context.js';
import { validateBody } from '../../http/validate.js';
import { ok } from '../../http/respond.js';
import { prisma } from '../../lib/prisma.js';

const ScheduleReportSchema = z.object({
  name: z.string().min(3).max(120),
  cron: z.string().min(5).max(80),
  filters: z.record(z.unknown()).default({}),
  recipients: z.array(z.string().email()).min(1).max(20),
});

export const reportsRouter = Router();

reportsRouter.post(
  '/scheduled',
  requireAuth,
  requireRole('SP', 'ANALYST', 'ADMIN'),
  validateBody(ScheduleReportSchema),
  async (req, res, next) => {
    try {
      const report = await prisma.scheduledReport.create({ data: { ...req.body, userId: req.user!.id } });
      ok(res, report, 201);
    } catch (error) {
      next(error);
    }
  },
);

reportsRouter.get('/scheduled', requireAuth, async (req, res, next) => {
  try {
    ok(res, await prisma.scheduledReport.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } }));
  } catch (error) {
    next(error);
  }
});
