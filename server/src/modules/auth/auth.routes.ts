import { Router } from 'express';
import {
  ForgotPasswordRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
} from '@aegis/shared';
import { validateBody } from '../../http/validate.js';
import { ok } from '../../http/respond.js';
import { requireAuth } from '../../http/auth-context.js';
import { authService } from './auth.service.js';

export const authRouter = Router();

authRouter.post('/login', validateBody(LoginRequestSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    ok(res, result);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/refresh', validateBody(RefreshTokenRequestSchema), async (req, res, next) => {
  try {
    ok(
      res,
      await authService.refresh(req.body.refreshToken, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      }),
    );
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', validateBody(RefreshTokenRequestSchema), async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    ok(res, { success: true });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/forgot-password', validateBody(ForgotPasswordRequestSchema), async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    ok(res, { submitted: true });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/session', requireAuth, (req, res) => {
  ok(res, { user: req.user });
});
