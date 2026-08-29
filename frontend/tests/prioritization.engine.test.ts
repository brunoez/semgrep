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
    expect(priority.isQuickWin).toBe(true); // High Severity + Low Effort (<= 2h) = Quick Win!
  });

  it('should NOT mark a High severity finding requiring 4h of effort as Quick Win', () => {
    const priority = calculateFindingPriority({
      severity: 'HIGH',
      impact: 'HIGH',
      confidence: 'HIGH',
      owasp: ['A03:2021 - Injection'],
      remediationHours: 4,
    });

    expect(priority.isQuickWin).toBe(false); // 4h effort is not a "quick win"
  });

  it('should mark a Secret Leak with 1h effort as Quick Win', () => {
    const priority = calculateFindingPriority({
      severity: 'HIGH',
      impact: 'HIGH',
      confidence: 'HIGH',
      owasp: ['A07:2021 - Identification and Authentication Failures'],
      remediationHours: 1,
    });

    expect(priority.isQuickWin).toBe(true);
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
