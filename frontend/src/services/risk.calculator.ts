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
  const penalty = (summary.critical * 25) + (summary.high * 10) + (summary.medium * 3) + (summary.low * 1);
  const score = Math.max(0, 100 - penalty);

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
