import { describe, expect, it, vi } from 'vitest';
import { createIdentifyUser, getVerifiedUid } from '../middleware/auth';

function makeReq(authorization?: string) {
  return { headers: authorization ? { authorization } : {}, path: '/api/hint' } as never;
}

function makeRes() {
  return { locals: {} as Record<string, unknown> };
}

describe('identifyUser', () => {
  it('ustawia zweryfikowany uid dla poprawnego tokenu', async () => {
    const verify = vi.fn().mockResolvedValue({ uid: 'user-123' });
    const res = makeRes();
    const next = vi.fn();

    await createIdentifyUser(verify)(makeReq('Bearer good-token'), res as never, next);

    expect(verify).toHaveBeenCalledWith('good-token');
    expect(getVerifiedUid(res as never)).toBe('user-123');
    expect(next).toHaveBeenCalledOnce();
  });

  it('traktuje brak tokenu jako gościa bez wywoływania weryfikacji', async () => {
    const verify = vi.fn();
    const res = makeRes();
    const next = vi.fn();

    await createIdentifyUser(verify)(makeReq(), res as never, next);

    expect(verify).not.toHaveBeenCalled();
    expect(getVerifiedUid(res as never)).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it('traktuje odrzucony token jako gościa (bez uid)', async () => {
    const verify = vi.fn().mockRejectedValue(new Error('auth/id-token-expired'));
    const res = makeRes();
    const next = vi.fn();

    await createIdentifyUser(verify)(makeReq('Bearer forged'), res as never, next);

    expect(getVerifiedUid(res as never)).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it('ignoruje nagłówek, który nie jest Bearer', async () => {
    const verify = vi.fn();
    const res = makeRes();

    await createIdentifyUser(verify)(makeReq('Basic dXNlcjpwYXNz'), res as never, vi.fn());

    expect(verify).not.toHaveBeenCalled();
    expect(getVerifiedUid(res as never)).toBeUndefined();
  });
});
