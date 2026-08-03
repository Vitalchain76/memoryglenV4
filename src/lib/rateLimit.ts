// src/lib/rateLimit.ts
//
// Hardened rate limiter (shared by LivingGlen + MemoryGlen), backed
// directly by the Upstash Redis REST API via fetch. This repo's
// package.json does not include @upstash/ratelimit or @upstash/redis, and
// adding a dependency here isn't possible without also regenerating
// package-lock.json from a real npm install -- so a small, dependency-free
// fixed-window limiter is implemented below instead of importing those
// packages.
//
// RUNTIME NOTE: uses the Web Request/Response API; intended to run
// server-side (Supabase Edge Function or serverless endpoint), NOT in the
// Vite client bundle. Reads UPSTASH_REDIS_REST_URL / _TOKEN from the server
// environment -- these must never be prefixed VITE_/NEXT_PUBLIC_.
//
// This file is type-checked as part of the Vite app's tsconfig (which only
// declares "vite/client" types, not Node's), so `process` is declared
// locally below rather than assuming @types/node is present.
declare const process: { env: Record<string, string | undefined> };

function upstashConfig(): { url: string; token: string } {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error('UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not configured.');
  }
  return { url, token };
}

export interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Epoch ms when the window resets. */
  reset: number;
}

/**
 * Minimal fixed-window limiter: one Redis INCR + a conditional EXPIRE (NX),
 * sent together via Upstash's REST /pipeline endpoint so each check is a
 * single round trip.
 */
class FixedWindowLimiter {
  constructor(
    private limitCount: number,
    private windowSeconds: number,
    private prefix: string,
  ) {}

  async limit(key: string): Promise<LimitResult> {
    const { url, token } = upstashConfig();
    const redisKey = `${this.prefix}:${key}`;
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, String(this.windowSeconds), 'NX'],
      ]),
    });
    if (!res.ok) throw new Error(`Upstash rate-limit request failed: ${res.status}`);
    const [incr] = (await res.json()) as Array<{ result: number }>;
    const count = incr.result;
    return {
      success: count <= this.limitCount,
      limit: this.limitCount,
      remaining: Math.max(0, this.limitCount - count),
      reset: Date.now() + this.windowSeconds * 1000,
    };
  }
}

export const passwordResetIpLimiter = new FixedWindowLimiter(3, 15 * 60, 'ratelimit:password-reset:ip');
export const passwordResetEmailLimiter = new FixedWindowLimiter(3, 15 * 60, 'ratelimit:password-reset:email');
export const generalFormLimiter = new FixedWindowLimiter(5, 60, 'ratelimit:form');

/**
 * Resolve the real client IP. Cloudflare fronts this app, so
 * cf-connecting-ip is authoritative and MUST be checked first: trusting
 * x-forwarded-for / x-real-ip ahead of it would let a request spoof a
 * different IP (those headers are attacker-controllable unless a trusted
 * proxy strips and rewrites them) and dodge these limits entirely.
 */
export function getClientIp(req: Request): string {
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

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
