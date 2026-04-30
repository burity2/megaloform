import jwt from 'jsonwebtoken';

const SECRET: string = process.env.JWT_SECRET ?? 'dev-only-secret-change-me';
if (SECRET === 'dev-only-secret-change-me') {
  console.warn('⚠️  JWT_SECRET not set — using dev default. DO NOT deploy like this.');
}

const EXPIRES_IN = '7d';

export type TokenPayload = {
  candidateId: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    if (typeof decoded === 'object' && decoded !== null && 'candidateId' in decoded) {
      return { candidateId: String((decoded as { candidateId: unknown }).candidateId) };
    }
    return null;
  } catch {
    return null;
  }
}
