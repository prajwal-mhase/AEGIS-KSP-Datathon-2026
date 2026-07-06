import crypto from 'node:crypto';
import argon2 from 'argon2';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { env } from '../../config/env.js';

export const signAccessToken = (user: Pick<User, 'id' | 'role' | 'district' | 'station'>) =>
  jwt.sign(
    { role: user.role, district: user.district, station: user.station },
    env.JWT_ACCESS_SECRET,
    { subject: user.id, expiresIn: env.ACCESS_TOKEN_TTL } as SignOptions,
  );

export const createOpaqueToken = () => crypto.randomBytes(48).toString('base64url');

export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const hashPassword = (password: string) => argon2.hash(password, { type: argon2.argon2id });

export const verifyPassword = (hash: string, password: string) => argon2.verify(hash, password);

export const refreshExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_TTL_DAYS);
  return expiresAt;
};
