import { describe, it, expect } from 'vitest';
import { calculateFindingPriority } from '../src/services/prioritization.engine';

describe('Vulnerability Prioritization Engine', () => {
  it('should assign P1 Urgent priority to Critical findings with High Impact and Confidence', () => {
    const priority = calculateFindingPriority({
      severity: 'CRITICAL',
      impact: 'HIGH',
      confidence: 'HIGH',
      owasp: ['A03:2021 - Injection'],
      remediationHours: 2,
    });

    expect(priority.tier).toBe('P1');
    expect(priority.score).toBeGreaterThanOrEqual(85);
    expect(priority.isQuickWin).toBe(true); // High Severity + Low Effort = Quick Win!
  });

  it('should assign P4 Low priority to Low severity findings', () => {
    const priority = calculateFindingPriority({
      severity: 'LOW',
      impact: 'LOW',
      confidence: 'LOW',
      owasp: [],
      remediationHours: 0.5,
    });

    expect(priority.tier).toBe('P4');
    expect(priority.score).toBeLessThan(40);
  });
});
