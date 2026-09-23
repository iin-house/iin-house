import { describe, it, expect, vi } from 'vitest';
import { getRequestId, logRequest, logError } from '@/lib/logger';

describe('getRequestId', () => {
  it('returns a UUID v4 string', () => {
    const id = getRequestId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(20);
  });

  it('returns unique IDs on repeated calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => getRequestId()));
    expect(ids.size).toBe(100);
  });
});

describe('logRequest', () => {
  it('logs a request object without throwing', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const req = new Request('http://localhost/api/test', { method: 'GET' });

    logRequest(req, Date.now(), { userId: 'user-1' });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const logged = consoleSpy.mock.calls[0][0];
    expect(logged.type).toBe('request');
    expect(logged.method).toBe('GET');
    expect(logged.path).toBe('/api/test');
    expect(logged.userId).toBe('user-1');

    consoleSpy.mockRestore();
  });

  it('includes duration in the log', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const req = new Request('http://localhost/api/test', { method: 'POST' });
    const startTime = Date.now() - 150;

    logRequest(req, startTime);

    const logged = consoleSpy.mock.calls[0][0];
    expect(logged.duration).toMatch(/\d+ms/);

    consoleSpy.mockRestore();
  });

  it('works without extra context', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const req = new Request('http://localhost/');

    logRequest(req, Date.now());

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });
});

describe('logError', () => {
  it('logs an error without throwing', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Something went wrong');

    logError(error, { userId: 'user-1' });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const logged = consoleSpy.mock.calls[0][0];
    expect(logged.type).toBe('error');
    expect(logged.message).toBe('Something went wrong');
    expect(logged.stack).toBeTruthy();
    expect(logged.userId).toBe('user-1');

    consoleSpy.mockRestore();
  });

  it('handles null context', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('test');

    logError(error);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });
});
