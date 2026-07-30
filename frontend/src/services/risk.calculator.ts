export interface RiskScoreResult {
  score: number;
  level: string;
  color: string;
  badgeClass: string;
  weightedImpact: number;
  breakdown: {
    criticalCount: number;
    criticalPts: number;
    highCount: number;
    highPts: number;
    mediumCount: number;
    mediumPts: number;
    lowCount: number;
    lowPts: number;
  };
}

export function calculateExecutiveRiskScore(summary: {
  critical: number;
  high: number;
  medium: number;
  low: number;
}): RiskScoreResult {
  const criticalPts = summary.critical * 15;
  const highPts = summary.high * 5;
  const mediumPts = summary.medium * 1.5;
  const lowPts = summary.low * 0.5;
  const weightedImpact = criticalPts + highPts + mediumPts + lowPts;

  const totalFindings = summary.critical + summary.high + summary.medium + summary.low;
  if (totalFindings === 0) {
    return {
      score: 100,
      level: 'Excelente / Baixo Risco',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      weightedImpact: 0,
      breakdown: {
        criticalCount: 0, criticalPts: 0,
        highCount: 0, highPts: 0,
        mediumCount: 0, mediumPts: 0,
        lowCount: 0, lowPts: 0,
      },
    };
  }

  // Logarithmic risk scale: handles both small & large enterprise scans without immediate saturation
  const score = Math.max(0, Math.round(100 - 40 * Math.log10(1 + weightedImpact / 10)));

  let level = 'Risco Crítico';
  let color = '#ef4444';
  let badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  if (score >= 90) {
    level = 'Excelente / Baixo Risco';
    color = '#10b981';
    badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 70) {
    level = 'Risco Moderado';
    color = '#f59e0b';
    badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (score >= 50) {
    level = 'Alto Risco';
    color = '#f97316';
    badgeClass = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  }

  return {
    score,
    level,
    color,
    badgeClass,
    weightedImpact,
    breakdown: {
      criticalCount: summary.critical, criticalPts,
      highCount: summary.high, highPts,
      mediumCount: summary.medium, mediumPts,
      lowCount: summary.low, lowPts,
    },
  };
}
