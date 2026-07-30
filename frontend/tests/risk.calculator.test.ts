import { describe, it, expect } from 'vitest';
import { calculateExecutiveRiskScore } from '../src/services/risk.calculator';

describe('Executive Risk Calculator', () => {
  it('should return 100 Low Risk score when 0 vulnerabilities exist', () => {
    const summary = { critical: 0, high: 0, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(100);
    expect(result.level).toBe('Excelente / Baixo Risco');
    expect(result.weightedImpact).toBe(0);
  });

  it('should decrease score logarithmically and provide detailed points breakdown', () => {
    const summary = { critical: 2, high: 1, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(74);
    expect(result.level).toBe('Risco Moderado');
    expect(result.breakdown.criticalPts).toBe(30);
    expect(result.breakdown.highPts).toBe(5);
    expect(result.weightedImpact).toBe(35);
  });

  it('should calculate meaningful score for large scan reports', () => {
    const summary = { critical: 3, high: 143, medium: 43, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(23);
    expect(result.level).toBe('Risco Crítico');
    expect(result.weightedImpact).toBe(824.5);
  });
});
