import { Router } from 'express';
import { AnalyticsFilterSchema } from '@aegis/shared';
import { requireAuth } from '../../http/auth-context.js';
import { validateQuery } from '../../http/validate.js';
import { ok } from '../../http/respond.js';
import { analyticsService } from './analytics.service.js';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', requireAuth, validateQuery(AnalyticsFilterSchema), async (req, res, next) => {
  try {
    ok(res, await analyticsService.overview(req.query));
  } catch (error) {
    next(error);
  }
});

analyticsRouter.get('/categories', requireAuth, validateQuery(AnalyticsFilterSchema), async (req, res, next) => {
  try {
    ok(res, await analyticsService.categories(req.query));
  } catch (error) {
    next(error);
  }
});

analyticsRouter.get('/trends', requireAuth, validateQuery(AnalyticsFilterSchema), async (req, res, next) => {
  try {
    ok(res, await analyticsService.trends(req.query));
  } catch (error) {
    next(error);
  }
});

analyticsRouter.get('/geo', requireAuth, validateQuery(AnalyticsFilterSchema), async (req, res, next) => {
  try {
    ok(res, await analyticsService.geo(req.query));
  } catch (error) {
    next(error);
  }
});
