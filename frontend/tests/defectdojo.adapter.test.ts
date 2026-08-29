import { describe, it, expect } from 'vitest';
import { parseAndNormalizeSemgrepReport } from '../src/services/defectdojo.adapter';
import { SemgrepFindingSchema } from '../src/models/semgrep.schema';
import fs from 'fs';
import path from 'path';

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

  it('should parse findings with severity MEDIUM or HIGH or LOW without enum errors', () => {
    const jsonWithMediumSeverity = JSON.stringify({
      version: '1.170.1',
      results: [
        {
          check_id: 'sample.medium.rule',
          path: 'src/file.js',
          start: { line: 10, col: 1 },
          end: { line: 10, col: 20 },
          extra: {
            message: 'Medium risk finding',
            severity: 'MEDIUM',
            lines: 'const x = 1;',
            metadata: {
              impact: 'MEDIUM',
              confidence: 'MEDIUM'
            }
          }
        }
      ]
    });

    const report = parseAndNormalizeSemgrepReport(jsonWithMediumSeverity);
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0].severity).toBe('MEDIUM');
  });

  it('should parse real scan report docs/resultado_semgrep.json without errors', () => {
    const realReportPath = path.join(__dirname, '../../docs/resultado_semgrep.json');
    if (fs.existsSync(realReportPath)) {
      const realContent = fs.readFileSync(realReportPath, 'utf-8');
      const report = parseAndNormalizeSemgrepReport(realContent);
      expect(report.findings.length).toBeGreaterThan(0);
    }
  });

  it('should reject non-JSON or invalid schema input safely', () => {
    expect(() => parseAndNormalizeSemgrepReport('invalid json')).toThrow('Formato de JSON inválido');
  });

  it('SemgrepFindingSchema should strip unknown arbitrary properties from metadata and extra', () => {
    const rawFindingWithJunk = {
      check_id: 'test.rule.id',
      path: 'src/index.ts',
      start: { line: 1, col: 1 },
      end: { line: 1, col: 10 },
      unknown_root_property: 'should_be_stripped',
      extra: {
        message: 'Test message',
        severity: 'INFO',
        unknown_extra_property: 'should_be_stripped_too',
        metadata: {
          category: 'security',
          unknown_metadata_property: 'should_be_stripped_as_well'
        }
      }
    };

    const parsed = SemgrepFindingSchema.parse(rawFindingWithJunk);
    expect((parsed as any).unknown_root_property).toBeUndefined();
    expect((parsed.extra as any).unknown_extra_property).toBeUndefined();
    expect(((parsed.extra.metadata || {}) as any).unknown_metadata_property).toBeUndefined();
  });
});

