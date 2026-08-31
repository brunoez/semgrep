import { create } from 'zustand';
import type { NormalizedReport } from '../models/normalized.domain';
import { parseAndNormalizeSemgrepReport } from '../services/defectdojo.adapter';

interface SemgrepStoreState {
  report: NormalizedReport | null;
  isLoading: boolean;
  error: string | null;
  loadJson: (jsonContent: string) => void;
  loadSample: () => Promise<void>;
  reset: () => void;
}

export const useSemgrepStore = create<SemgrepStoreState>((set) => ({
  report: null,
  isLoading: false,
  error: null,

  loadJson: (jsonContent: string) => {
    set({ isLoading: true, error: null });
    try {
      if (jsonContent.length > 50 * 1024 * 1024) {
        throw new Error('O arquivo excede o limite de segurança de 50MB.');
      }
      const normalized = parseAndNormalizeSemgrepReport(jsonContent);
      set({ report: normalized, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Erro ao carregar o relatório Semgrep', isLoading: false });
    }
  },

  loadSample: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/samples/semgrep-sample-report.json', {
        signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
      });
      if (!res.ok) throw new Error('Não foi possível carregar o relatório de exemplo.');
      const text = await res.text();
      const normalized = parseAndNormalizeSemgrepReport(text);
      set({ report: normalized, isLoading: false });
    } catch (err: any) {
      const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError' || err.message?.includes('aborted');
      const errorMessage = isTimeout
        ? 'Tempo limite esgotado ao carregar o exemplo de relatório.'
        : (err.message || 'Erro ao carregar exemplo');
      set({ error: errorMessage, isLoading: false });
    }
  },

  reset: () => set({ report: null, error: null, isLoading: false }),
}));
