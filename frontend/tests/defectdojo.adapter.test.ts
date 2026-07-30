import { describe, it, expect } from 'vitest';
import { parseAndNormalizeSemgrepReport } from '../src/services/defectdojo.adapter';

describe('DefectDojo Semgrep Adapter', () => {
  it('should parse valid Semgrep CLI JSON output into normalized domain findings', () => {
    const rawSemgrepJson = JSON.stringify({
      version: '1.45.0',
      results: [
        {
          check_id: 'rules.python.lang.security.deserialization.pickle',
          path: 'app/utils.py',
          start: { line: 42, col: 5 },
          end: { line: 42, col: 25 },
          extra: {
            message: 'Avoid unpickling untrusted data',
            severity: 'ERROR',
            lines: 'data = pickle.loads(user_input)',
            metadata: {
              cwe: ['CWE-502'],
              owasp: ['A08:2021 - Software and Data Integrity Failures'],
              impact: 'HIGH',
              confidence: 'HIGH'
            }
          }
        }
      ]
    });

    const report = parseAndNormalizeSemgrepReport(rawSemgrepJson);

    expect(report.findings).toHaveLength(1);
    expect(report.findings[0].severity).toBe('CRITICAL');
    expect(report.findings[0].checkId).toBe('rules.python.lang.security.deserialization.pickle');
    expect(report.findings[0].filePath).toBe('app/utils.py');
    expect(report.findings[0].cwe).toContain('CWE-502');
    expect(report.findings[0].owasp).toContain('A08:2021 - Software and Data Integrity Failures');
  });

  it('should reject non-JSON or invalid schema input safely', () => {
    expect(() => parseAndNormalizeSemgrepReport('invalid json')).toThrow('Formato de JSON inválido');
  });
});
