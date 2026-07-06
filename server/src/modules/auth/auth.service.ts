import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/errors.js';
import {
  createOpaqueToken,
  hashToken,
  refreshExpiry,
  signAccessToken,
  verifyPassword,
} from './token.service.js';

const publicUser = (user: {
  id: string;
  name: string;
  email: string;
  role: 'OFFICER' | 'INSPECTOR' | 'SP' | 'ANALYST' | 'ADMIN';
  district: string | null;
  station: string | null;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  district: user.district,
  station: user.station,
});

export class AuthService {
  async login(email: string, password: string, metadata: { ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive || !(await verifyPassword(user.passwordHash, password))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const refreshToken = createOpaqueToken();
    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: refreshExpiry(),
        ipAddress: metadata.ipAddress ?? null,
        userAgent: metadata.userAgent ?? null,
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: 'AUTH_LOGIN', entity: 'User', entityId: user.id, ipAddress: metadata.ipAddress ?? null },
    });

    return { accessToken: signAccessToken(user), refreshToken, user: publicUser(user) };
  }

  async refresh(refreshToken: string, metadata: { ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const tokenHash = hashToken(refreshToken);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
    if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || !stored.user.isActive) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired.');
    }

    const nextRefreshToken = createOpaqueToken();
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date(), replacedBy: hashToken(nextRefreshToken) },
      }),
      prisma.refreshToken.create({
        data: {
          tokenHash: hashToken(nextRefreshToken),
          userId: stored.userId,
          expiresAt: refreshExpiry(),
          ipAddress: metadata.ipAddress ?? null,
          userAgent: metadata.userAgent ?? null,
        },
      }),
    ]);

    return {
      accessToken: signAccessToken(stored.user),
      refreshToken: nextRefreshToken,
      user: publicUser(stored.user),
    };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.auditLog.create({
        data: { userId: user.id, action: 'AUTH_PASSWORD_RESET_REQUESTED', entity: 'User', entityId: user.id },
      });
    }
  }
}

export const authService = new AuthService();
