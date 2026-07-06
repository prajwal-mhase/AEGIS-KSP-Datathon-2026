import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './http/error-handler.js';
import { requestId } from './http/request-id.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { analyticsRouter } from './modules/analytics/analytics.routes.js';
import { crimeRouter } from './modules/crime/crime.routes.js';
import { aiRouter } from './modules/ai/ai.routes.js';
import { reportsRouter } from './modules/reports/reports.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestId);
  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX, standardHeaders: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'aegis-api', requestId: res.locals.requestId });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/crimes', crimeRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/reports', reportsRouter);
  app.use('/api/admin', adminRouter);

  app.use(errorHandler);
  return app;
};
