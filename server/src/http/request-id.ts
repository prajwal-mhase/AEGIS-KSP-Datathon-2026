import type { RequestHandler } from 'express';
import { nanoid } from 'nanoid';

export const requestId: RequestHandler = (req, res, next) => {
  const id = String(req.headers['x-request-id'] ?? nanoid());
  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
};
