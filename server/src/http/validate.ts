import type { RequestHandler } from 'express';
import type { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

export const validateBody =
  (schema: AnyZodObject): RequestHandler =>
  (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(toValidationError(error));
    }
  };

export const validateQuery =
  (schema: AnyZodObject): RequestHandler =>
  (req, _res, next) => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      next(toValidationError(error));
    }
  };

const toValidationError = (error: unknown) =>
  new AppError(400, 'VALIDATION_ERROR', 'The request payload is invalid.', (error as ZodError).flatten?.());
