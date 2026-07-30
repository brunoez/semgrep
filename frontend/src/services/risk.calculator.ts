export interface RiskScoreResult {
  score: number;
  level: string;
  color: string;
  badgeClass: string;
}

export function calculateExecutiveRiskScore(summary: {
  critical: number;
  high: number;
  medium: number;
  low: number;
}): RiskScoreResult {
  const totalFindings = summary.critical + summary.high + summary.medium + summary.low;
  if (totalFindings === 0) {
    return { score: 100, level: 'Excelente / Baixo Risco', color: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  }

  // Logarithmic risk scale: handles both small & large enterprise scans without immediate saturation
  const weightedImpact = (summary.critical * 15) + (summary.high * 5) + (summary.medium * 1.5) + (summary.low * 0.5);
  const score = Math.max(0, Math.round(100 - 40 * Math.log10(1 + weightedImpact / 10)));

  if (score >= 90) {
    return { score, level: 'Excelente / Baixo Risco', color: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  }
  if (score >= 70) {
    return { score, level: 'Risco Moderado', color: '#f59e0b', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  }
  if (score >= 50) {
    return { score, level: 'Alto Risco', color: '#f97316', badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
  }
  return { score, level: 'Risco Crítico', color: '#ef4444', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
}
