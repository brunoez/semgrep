import { describe, it, expect } from 'vitest';
import { calculateExecutiveRiskScore } from '../src/services/risk.calculator';

describe('Executive Risk Calculator with Letter Grades', () => {
  it('should return Grade A+ and 100 Score when 0 vulnerabilities exist', () => {
    const summary = { critical: 0, high: 0, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A+');
    expect(result.level).toBe('Excelente / Baixo Risco');
  });

  it('should return Grade B and 74 Score for moderate findings', () => {
    const summary = { critical: 2, high: 1, medium: 0, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(74);
    expect(result.grade).toBe('B');
    expect(result.level).toBe('Risco Moderado');
  });

  it('should return Grade F for critical report with many findings', () => {
    const summary = { critical: 3, high: 143, medium: 43, low: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(23);
    expect(result.grade).toBe('F');
    expect(result.level).toBe('Risco Crítico / Reprovado');
  });
});
