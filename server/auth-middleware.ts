import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from './jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header.' });
  }

  const token = header.slice(7).trim();
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  req.user = payload;
  next();
}

export function requireOwnership(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  if (req.user.candidateId !== req.params.id) {
    return res.status(403).json({ message: 'You can only access your own data.' });
  }

  next();
}
