import type { NormalizedSeverity, PriorityAnalysis, PriorityTier } from '../models/normalized.domain';

interface InputParams {
  severity: NormalizedSeverity;
  impact?: string;
  confidence?: string;
  owasp: string[];
  remediationHours: number;
}

export function calculateFindingPriority(input: InputParams): PriorityAnalysis {
  let score = 0;

  // Base score from severity
  switch (input.severity) {
    case 'CRITICAL': score += 50; break;
    case 'HIGH': score += 35; break;
    case 'MEDIUM': score += 20; break;
    case 'LOW': score += 10; break;
    case 'INFO': score += 5; break;
  }

  // Impact and confidence multipliers
  const imp = (input.impact || '').toUpperCase();
  const conf = (input.confidence || '').toUpperCase();

  if (imp === 'HIGH') score += 15;
  else if (imp === 'MEDIUM') score += 8;

  if (conf === 'HIGH') score += 10;
  else if (conf === 'MEDIUM') score += 5;

  // High-risk OWASP categories boost
  const isHighRiskOwasp = input.owasp.some(o => 
    o.includes('A01') || o.includes('A03') || o.includes('A08') || o.includes('Injection') || o.includes('Access Control')
  );
  if (isHighRiskOwasp) score += 15;

  // Quick Win: High/Critical severity or High OWASP Risk WITH low remediation effort (<= 2h)
  const isQuickWin = (input.severity === 'CRITICAL' || input.severity === 'HIGH' || isHighRiskOwasp) && input.remediationHours <= 2;
  if (isQuickWin) score += 10;

  const finalScore = Math.min(100, Math.max(1, Math.round(score)));

  let tier: PriorityTier = 'P4';
  let label = 'P4 - Baixa Prioridade';
  let badgeClass = 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  if (finalScore >= 80) {
    tier = 'P1';
    label = 'P1 - Correção Urgente';
    badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (finalScore >= 60) {
    tier = 'P2';
    label = 'P2 - Alta Prioridade';
    badgeClass = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  } else if (finalScore >= 40) {
    tier = 'P3';
    label = 'P3 - Média Prioridade';
    badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const rationaleParts: string[] = [];
  if (input.severity === 'CRITICAL') rationaleParts.push('Severidade Crítica');
  if (isHighRiskOwasp) rationaleParts.push('Vulnerabilidade OWASP de Alto Risco');
  if (isQuickWin) rationaleParts.push('Quick Win (Baixo esforço de correção <= 2h)');

  return {
    score: finalScore,
    tier,
    label,
    badgeClass,
    isQuickWin,
    rationale: rationaleParts.join(' • ') || 'Priorização padrão baseada em impacto',
  };
}
