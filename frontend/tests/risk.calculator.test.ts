import { describe, it, expect } from 'vitest';
import { calculateExecutiveRiskScore } from '../src/services/risk.calculator';

describe('Executive Risk Calculator', () => {
  it('should return 100 Low Risk score when 0 vulnerabilities exist', () => {
    const summary = { critical: 0, high: 0, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(100);
    expect(result.level).toBe('Excelente / Baixo Risco');
  });

  it('should decrease score accurately based on critical and high vulnerabilities', () => {
    const summary = { critical: 2, high: 1, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(40); // 100 - (2*25 + 1*10) = 40
    expect(result.level).toBe('Risco Crítico');
  });
});
