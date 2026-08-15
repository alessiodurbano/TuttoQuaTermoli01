import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../lib/env.js';
import { prisma } from '../lib/prisma.js';

export const AUTH_COOKIE = 'tq_admin';
const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 ore

export interface AdminSession {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
}

interface TokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function issueSession(res: Response, user: { id: string; email: string; role: string }): void {
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: TOKEN_TTL_SECONDS,
  });

  // Cookie httpOnly: non leggibile da JavaScript, quindi immune a XSS.
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    maxAge: TOKEN_TTL_SECONDS * 1000,
    path: '/',
  });
}

export function clearSession(res: Response): void {
  res.clearCookie(AUTH_COOKIE, { path: '/' });
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[AUTH_COOKIE] as string | undefined;

  if (!token) {
    res.status(401).json({ error: 'Non autenticato' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      clearSession(res);
      res.status(401).json({ error: 'Sessione non più valida' });
      return;
    }

    req.admin = user;
    next();
  } catch {
    clearSession(res);
    res.status(401).json({ error: 'Sessione scaduta' });
  }
}
