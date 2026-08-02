// src/lib/rateLimit.ts
//
// Hardened Upstash Redis rate limiter (shared by LivingGlen + MemoryGlen).
// RUNTIME NOTE: uses the Web Request/Response API; intended to run server-side
// (Supabase Edge Function or serverless endpoint), NOT in the Vite client bundle.
// Redis.fromEnv() reads UPSTASH_REDIS_REST_URL / _TOKEN from the server env.

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const passwordResetIpLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
  prefix: 'ratelimit:password-reset:ip',
  analytics: true,
  ephemeralCache: new Map(),
});

export const passwordResetEmailLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
  prefix: 'ratelimit:password-reset:email',
  analytics: true,
  ephemeralCache: new Map(),
});

export const generalFormLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  prefix: 'ratelimit:form',
  analytics: true,
  ephemeralCache: new Map(),
});

export function getClientIp(req: Request): string {
  const vercelIp = req.headers.get('x-real-ip');
  if (vercelIp) return vercelIp;

  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const forwarded = req.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || 'unknown';
}

function retryHeaders(reset: number, limit: number, remaining: number): HeadersInit {
  return {
    'Retry-After': String(Math.max(0, Math.ceil((reset - Date.now()) / 1000))),
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
  };
}

export async function checkPasswordResetLimit(req: Request, targetEmail: string) {
  const ip = getClientIp(req);
  const normalizedEmail = targetEmail.trim().toLowerCase();

  const [ipResult, emailResult] = await Promise.all([
    passwordResetIpLimiter.limit(ip),
    passwordResetEmailLimiter.limit(normalizedEmail),
  ]);

  if (!ipResult.success || !emailResult.success) {
    const stricter = ipResult.remaining <= emailResult.remaining ? ipResult : emailResult;
    return {
      allowed: false,
      response: new Response(
        JSON.stringify({ message: 'If an account exists for this address, a reset email has been sent.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...retryHeaders(stricter.reset, stricter.limit, stricter.remaining),
          },
        },
      ),
    };
  }

  return { allowed: true as const };
}

export async function checkGeneralFormLimit(req: Request) {
  const ip = getClientIp(req);
  const { success, limit, remaining, reset } = await generalFormLimiter.limit(ip);

  if (!success) {
    return {
      allowed: false,
      response: new Response(JSON.stringify({ message: 'Too many requests. Please slow down.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...retryHeaders(reset, limit, remaining) },
      }),
    };
  }

  return { allowed: true as const };
}
