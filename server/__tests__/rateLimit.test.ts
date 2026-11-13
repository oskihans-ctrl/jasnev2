import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '../rateLimit';

function makeReq(ip: string, body: Record<string, unknown> = {}) {
  return { ip, method: 'POST', path: '/api/hint', body, socket: { remoteAddress: ip } } as never;
}

function makeRes(verifiedUid?: string) {
  const res = {
    locals: verifiedUid ? { uid: verifiedUid } : {},
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    setHeader(key: string, value: string) {
      res.headers[key] = value;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
  };
  return res;
}

describe('createRateLimiter', () => {
  it('przepuszcza żądania do limitu i blokuje kolejne z Retry-After', () => {
    const limiter = createRateLimiter({ rules: [{ bucket: 'ai', windowMs: 60_000, max: 3 }] });

    for (let i = 0; i < 3; i += 1) {
      const next = (): void => {
        throw new Error('next() nie powinien zostać wywołany dla dozwolonego żądania w tym teście');
      };
      const res = makeRes();
      let called = false;
      limiter.middleware(makeReq('10.0.0.1'), res as never, () => {
        called = true;
      });
      expect(called).toBe(true);
      expect(res.statusCode).toBe(200);
      void next;
    }

    const blocked = makeRes();
    let passedThrough = false;
    limiter.middleware(makeReq('10.0.0.1'), blocked as never, () => {
      passedThrough = true;
    });

    expect(passedThrough).toBe(false);
    expect(blocked.statusCode).toBe(429);
    expect(Number(blocked.headers['Retry-After'])).toBeGreaterThan(0);
    expect(blocked.headers['X-RateLimit-Remaining']).toBe('0');
    expect((blocked.body as { code?: string }).code).toBe('rate_limited');
  });

  it('trzyma osobne koszyki dla różnych IP oraz dla użytkownika (uid)', () => {
    const limiter = createRateLimiter({ rules: [{ bucket: 'ai', windowMs: 60_000, max: 1 }] });

    const first = makeRes();
    limiter.middleware(makeReq('10.0.0.1'), first as never, () => {});
    const secondIp = makeRes();
    let secondIpPassed = false;
    limiter.middleware(makeReq('10.0.0.2'), secondIp as never, () => {
      secondIpPassed = true;
    });
    expect(secondIpPassed).toBe(true);

    // To samo IP, inny zweryfikowany uid -> nowy koszyk.
    const withUidLimiter = createRateLimiter({ rules: [{ bucket: 'ai', windowMs: 60_000, max: 1 }] });
    withUidLimiter.middleware(makeReq('10.0.0.9'), makeRes('user-a') as never, () => {});
    let otherUidPassed = false;
    withUidLimiter.middleware(makeReq('10.0.0.9'), makeRes('user-b') as never, () => {
      otherUidPassed = true;
    });
    expect(otherUidPassed).toBe(true);
  });

  it('ignoruje uid z body — rotacja uid nie omija limitu gościa', () => {
    const limiter = createRateLimiter({ rules: [{ bucket: 'ai', windowMs: 60_000, max: 1 }] });
    limiter.middleware(makeReq('10.0.0.7', { uid: 'fake-1' }), makeRes() as never, () => {});

    const blocked = makeRes();
    let passed = false;
    limiter.middleware(makeReq('10.0.0.7', { uid: 'fake-2' }), blocked as never, () => {
      passed = true;
    });
    expect(passed).toBe(false);
    expect(blocked.statusCode).toBe(429);
  });

  it('stosuje guestMax dla gościa i max dla zweryfikowanego użytkownika', () => {
    const limiter = createRateLimiter({ rules: [{ bucket: 'ai', windowMs: 60_000, max: 3, guestMax: 1 }] });

    limiter.middleware(makeReq('10.0.0.8'), makeRes() as never, () => {});
    let guestPassed = false;
    limiter.middleware(makeReq('10.0.0.8'), makeRes() as never, () => {
      guestPassed = true;
    });
    expect(guestPassed).toBe(false);

    let userPasses = 0;
    for (let i = 0; i < 4; i += 1) {
      limiter.middleware(makeReq('10.0.0.8'), makeRes('user-x') as never, () => {
        userPasses += 1;
      });
    }
    expect(userPasses).toBe(3);
  });

  it('nie limituje preflightów OPTIONS', () => {
    const limiter = createRateLimiter({ rules: [{ bucket: 'ai', windowMs: 60_000, max: 0 }] });
    const res = makeRes();
    let passed = false;
    limiter.middleware({ ip: '1.1.1.1', method: 'OPTIONS', path: '/api/hint', body: {}, socket: {} } as never, res as never, () => {
      passed = true;
    });
    expect(passed).toBe(true);
    expect(res.statusCode).toBe(200);
  });

  it('reset() czyści stan limitera', () => {
    const limiter = createRateLimiter({ rules: [{ bucket: 'ai', windowMs: 60_000, max: 1 }] });
    limiter.middleware(makeReq('10.0.0.5'), makeRes() as never, () => {});
    expect(limiter.snapshot().keys).toBe(1);

    limiter.reset();
    expect(limiter.snapshot().keys).toBe(0);
  });
});
