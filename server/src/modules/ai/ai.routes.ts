import { Router } from 'express';
import { ChatRequestSchema } from '@aegis/shared';
import { requireAuth } from '../../http/auth-context.js';
import { validateBody } from '../../http/validate.js';
import { ok } from '../../http/respond.js';
import { chatService } from './chat.service.js';

export const aiRouter = Router();

aiRouter.post('/chat', requireAuth, validateBody(ChatRequestSchema), async (req, res, next) => {
  try {
    ok(res, await chatService.answer(req.user!.id, req.body));
  } catch (error) {
    next(error);
  }
});

aiRouter.get('/conversations', requireAuth, async (req, res, next) => {
  try {
    const conversations = await import('../../lib/prisma.js').then(({ prisma }) =>
      prisma.conversation.findMany({
        where: { userId: req.user!.id },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, updatedAt: true },
        take: 30,
      }),
    );
    ok(
      res,
      conversations.map((item) => ({ ...item, updatedAt: item.updatedAt.toISOString() })),
    );
  } catch (error) {
    next(error);
  }
});
