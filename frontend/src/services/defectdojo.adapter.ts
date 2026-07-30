import { SemgrepReportSchema } from '../models/semgrep.schema';
import type { NormalizedFinding, NormalizedReport, NormalizedSeverity } from '../models/normalized.domain';
import { calculateFindingPriority } from './prioritization.engine';

function mapSeverity(semgrepSeverity?: string, impact?: string, confidence?: string): NormalizedSeverity {
  const sev = (semgrepSeverity || '').toUpperCase();
  const imp = (impact || '').toUpperCase();
  const conf = (confidence || '').toUpperCase();

  if (sev === 'CRITICAL' || (sev === 'ERROR' && imp === 'HIGH' && conf === 'HIGH')) {
    return 'CRITICAL';
  }
  if (sev === 'HIGH' || sev === 'ERROR') {
    return 'HIGH';
  }
  if (sev === 'MEDIUM' || sev === 'WARNING') {
    return 'MEDIUM';
  }
  if (sev === 'LOW' || sev === 'INFO') {
    return 'LOW';
  }
  return 'LOW';
}

function calculateRemediationHours(severity: NormalizedSeverity): number {
  switch (severity) {
    case 'CRITICAL': return 8;
    case 'HIGH': return 4;
    case 'MEDIUM': return 2;
    case 'LOW': return 0.5;
    case 'INFO': return 0.25;
  }
}

export function parseAndNormalizeSemgrepReport(jsonString: string): NormalizedReport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Formato de JSON inválido');
  }

  const result = SemgrepReportSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Schema Semgrep inválido: ${result.error.issues[0]?.message || 'Estrutura incorreta'}`);
  }

  const data = result.data;
  const findings: NormalizedFinding[] = data.results.map((item, index) => {
    const meta = item.extra.metadata || {};
    const impact = meta.impact;
    const confidence = meta.confidence;
    const rawSeverity = item.extra.severity || meta.severity;
    const severity = mapSeverity(rawSeverity, impact, confidence);
    
    let cweList: string[] = [];
    if (Array.isArray(meta.cwe)) {
      cweList = meta.cwe.filter(c => typeof c === 'string') as string[];
    } else if (typeof meta.cwe === 'string') {
      cweList = [meta.cwe];
    }

    const owaspList = Array.isArray(meta.owasp) ? meta.owasp : meta.owasp ? [meta.owasp] : [];
    const remediationHours = calculateRemediationHours(severity);

    const priority = calculateFindingPriority({
      severity,
      impact,
      confidence,
      owasp: owaspList,
      remediationHours,
    });

    return {
      id: `finding-${index}-${item.check_id}`,
      checkId: item.check_id,
      title: item.check_id.split('.').pop() || item.check_id,
      severity,
      filePath: item.path,
      startLine: item.start.line,
      endLine: item.end.line,
      startCol: item.start.col,
      endCol: item.end.col,
      message: item.extra.message,
      codeSnippet: item.extra.lines || '',
      cwe: cweList,
      owasp: owaspList,
      category: meta.category || 'Security',
      impact,
      confidence,
      remediationHours,
      priority,
    };
  });

  const summary = findings.reduce(
    (acc, f) => {
      acc.total += 1;
      acc.totalRemediationHours += f.remediationHours;
      if (f.priority.tier === 'P1') acc.p1Count += 1;
      if (f.priority.isQuickWin) acc.quickWinsCount += 1;

      if (f.severity === 'CRITICAL') acc.critical += 1;
      else if (f.severity === 'HIGH') acc.high += 1;
      else if (f.severity === 'MEDIUM') acc.medium += 1;
      else if (f.severity === 'LOW') acc.low += 1;
      else acc.info += 1;
      return acc;
    },
    { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0, p1Count: 0, quickWinsCount: 0, totalRemediationHours: 0 }
  );

  return {
    version: data.version || 'Unknown',
    scannedFilesCount: data.paths?.scanned?.length || new Set(findings.map(f => f.filePath)).size,
    findings,
    summary,
  };
}
