import { Router } from 'express';
import { CrimeFilterSchema, type CrimeFilter } from '@aegis/shared';
import { requireAuth } from '../../http/auth-context.js';
import { validateQuery } from '../../http/validate.js';
import { ok } from '../../http/respond.js';
import { crimeRepository } from './crime.repository.js';

export const crimeRouter = Router();

crimeRouter.get('/', requireAuth, validateQuery(CrimeFilterSchema), async (req, res, next) => {
  try {
    const scope = req.user?.role === 'OFFICER' || req.user?.role === 'INSPECTOR' ? req.user : undefined;
    ok(res, await crimeRepository.list(req.query as unknown as CrimeFilter, scope));
  } catch (error) {
    next(error);
  }
});

crimeRouter.get('/recent', requireAuth, async (_req, res, next) => {
  try {
    ok(res, await crimeRepository.recent());
  } catch (error) {
    next(error);
  }
});
