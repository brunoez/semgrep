import { SemgrepReportSchema } from '../models/semgrep.schema';
import type { NormalizedFinding, NormalizedReport, NormalizedSeverity, HotspotDirectory, TechShare } from '../models/normalized.domain';
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

function calculateRemediationHours(severity: NormalizedSeverity, checkId: string, vulnClasses: string[]): number {
  const check = checkId.toLowerCase();
  const isSecret = check.includes('secret') || check.includes('env') || vulnClasses.some(v => v.toLowerCase().includes('secret'));
  if (isSecret) return 1; // Rotação de chave / segredo em .env é 1h (Quick Win de alto ROI)

  switch (severity) {
    case 'CRITICAL': return 8;
    case 'HIGH': return 4;
    case 'MEDIUM': return 2;
    case 'LOW': return 0.5;
    case 'INFO': return 0.25;
  }
}

function getParentDirectory(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  if (parts.length <= 1) return 'Raiz do Projeto';
  return parts.slice(0, Math.min(2, parts.length - 1)).join('/');
}

function formatTechName(tech: string): string {
  const t = tech.toLowerCase().trim();
  if (t === 'js' || t === 'javascript') return 'JavaScript';
  if (t === 'ts' || t === 'typescript') return 'TypeScript';
  if (t === 'python' || t === 'py') return 'Python';
  if (t === 'secrets') return 'Secrets / Credenciais';
  if (t === 'docker' || t === 'dockerfile') return 'Docker / Infra';
  if (t === 'express') return 'Express.js';
  if (t === 'skills-audit') return 'AI Skills Audit';
  return t.charAt(0).toUpperCase() + t.slice(1);
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

    let techList: string[] = [];
    if (Array.isArray(meta.technology)) {
      techList = meta.technology.map(t => formatTechName(t));
    } else if (typeof meta.technology === 'string') {
      techList = [formatTechName(meta.technology)];
    }

    let vulnClassList: string[] = [];
    if (Array.isArray(meta.vulnerability_class)) {
      vulnClassList = meta.vulnerability_class;
    } else if (typeof meta.vulnerability_class === 'string') {
      vulnClassList = [meta.vulnerability_class];
    }

    const owaspList = Array.isArray(meta.owasp) ? meta.owasp : meta.owasp ? [meta.owasp] : [];
    const remediationHours = calculateRemediationHours(severity, item.check_id, vulnClassList);

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
      technology: techList,
      vulnerabilityClass: vulnClassList,
      impact,
      confidence,
      remediationHours,
      priority,
    };
  });

  // Calculate Directory Hotspots
  const directoryMap: Record<string, { total: number; critical: number; high: number }> = {};
  // Calculate Technology Distribution
  const techMap: Record<string, number> = {};

  findings.forEach((f) => {
    const dir = getParentDirectory(f.filePath);
    if (!directoryMap[dir]) {
      directoryMap[dir] = { total: 0, critical: 0, high: 0 };
    }
    directoryMap[dir].total += 1;
    if (f.severity === 'CRITICAL') directoryMap[dir].critical += 1;
    if (f.severity === 'HIGH') directoryMap[dir].high += 1;

    f.technology.forEach((tech) => {
      techMap[tech] = (techMap[tech] || 0) + 1;
    });
  });

  const totalFindingsCount = findings.length || 1;

  const topHotspots: HotspotDirectory[] = Object.entries(directoryMap)
    .map(([directoryPath, stats]) => ({
      directoryPath,
      findingCount: stats.total,
      criticalCount: stats.critical,
      highCount: stats.high,
      percentage: Math.round((stats.total / totalFindingsCount) * 100),
    }))
    .sort((a, b) => b.findingCount - a.findingCount)
    .slice(0, 5);

  const totalTechHits = Object.values(techMap).reduce((a, b) => a + b, 0) || 1;

  const techDistribution: TechShare[] = Object.entries(techMap)
    .map(([technology, count]) => ({
      technology,
      count,
      percentage: Math.round((count / totalTechHits) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const availableTechnologies = Array.from(new Set(findings.flatMap(f => f.technology))).sort();

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
    {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      p1Count: 0,
      quickWinsCount: 0,
      totalRemediationHours: 0,
      topHotspots,
      techDistribution,
      availableTechnologies,
    }
  );

  return {
    version: data.version || 'Unknown',
    scannedFilesCount: data.paths?.scanned?.length || new Set(findings.map(f => f.filePath)).size,
    findings,
    summary,
  };
}
