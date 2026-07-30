import { describe, it, expect } from 'vitest';
import { calculateExecutiveRiskScore } from '../src/services/risk.calculator';

describe('Executive Risk Calculator', () => {
  it('should return 100 Low Risk score when 0 vulnerabilities exist', () => {
    const summary = { critical: 0, high: 0, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(100);
    expect(result.level).toBe('Excelente / Baixo Risco');
  });

  it('should decrease score logarithmically based on critical and high vulnerabilities', () => {
    const summary = { critical: 2, high: 1, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    // impact = 2*15 + 1*5 = 35. 100 - 40 * log10(1 + 3.5) = 100 - 40 * 0.653 = 74
    expect(result.score).toBe(74);
    expect(result.level).toBe('Risco Moderado');
  });

  it('should calculate meaningful score for large scan reports', () => {
    const summary = { critical: 3, high: 143, medium: 43, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    // 3*15 + 143*5 + 43*1.5 = 45 + 715 + 64.5 = 824.5. 100 - 40 * log10(83.45) = 100 - 76.8 = 23
    expect(result.score).toBe(23);
    expect(result.level).toBe('Risco Crítico');
  });
});
