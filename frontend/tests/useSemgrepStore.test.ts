import { describe, it, expect, beforeEach } from 'vitest';
import { useSemgrepStore } from '../src/store/useSemgrepStore';

describe('useSemgrepStore (In-Memory)', () => {
  beforeEach(() => {
    useSemgrepStore.getState().reset();
  });

  it('should initialize with null report', () => {
    expect(useSemgrepStore.getState().report).toBeNull();
  });

  it('should load and parse JSON input successfully', () => {
    const rawJson = JSON.stringify({
      version: '1.45.0',
      results: [
        {
          check_id: 'sample.rule',
          path: 'src/app.ts',
          start: { line: 1, col: 1 },
          end: { line: 1, col: 10 },
          extra: { message: 'Sample message', severity: 'WARNING' }
        }
      ]
    });

    useSemgrepStore.getState().loadJson(rawJson);
    expect(useSemgrepStore.getState().report?.findings).toHaveLength(1);
    expect(useSemgrepStore.getState().error).toBeNull();
  });

  it('should handle fetch failure or timeout gracefully in loadSample', async () => {
    // Mock global fetch to simulate network timeout/failure
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      const err = new Error('The operation was aborted due to timeout');
      err.name = 'TimeoutError';
      throw err;
    };

    try {
      await useSemgrepStore.getState().loadSample();
      expect(useSemgrepStore.getState().isLoading).toBe(false);
      expect(useSemgrepStore.getState().error).toContain('Tempo limite esgotado');
      expect(useSemgrepStore.getState().report).toBeNull();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
