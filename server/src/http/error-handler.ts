import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';
import { logger } from '../config/logger.js';

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = String(req.headers['x-request-id'] ?? res.locals.requestId ?? '');

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: { code: error.code, message: error.message, details: error.details },
      requestId,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'The request payload is invalid.', details: error.flatten() },
      requestId,
    });
    return;
  }

  logger.error({ error, requestId }, 'Unhandled API error');
  res.status(500).json({
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' },
    requestId,
  });
};
