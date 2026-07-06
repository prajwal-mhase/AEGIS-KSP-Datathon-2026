import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { RoleSchema, type Role } from '@aegis/shared';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from '../lib/errors.js';

export type AuthUser = {
  id: string;
  role: Role;
  district?: string | null;
  station?: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(unauthorized());

  try {
    const payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    req.user = {
      id: String(payload.sub),
      role: RoleSchema.parse(payload.role),
      district: typeof payload.district === 'string' ? payload.district : null,
      station: typeof payload.station === 'string' ? payload.station : null,
    };
    next();
  } catch {
    next(unauthorized());
  }
};

export const requireRole =
  (...allowed: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (!allowed.includes(req.user.role)) return next(forbidden());
    next();
  };
