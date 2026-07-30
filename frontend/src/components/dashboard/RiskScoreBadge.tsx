import React from 'react';
import { HelpCircle, Calculator } from 'lucide-react';
import { calculateExecutiveRiskScore } from '../../services/risk.calculator';

interface Props {
  summary: { critical: number; high: number; medium: number; low: number };
}

export const RiskScoreBadge: React.FC<Props> = ({ summary }) => {
  const risk = calculateExecutiveRiskScore(summary);
  const { breakdown, weightedImpact } = risk;

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl relative group">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Executive Risk Score</p>
          
          {/* Help Icon with Hover Card */}
          <div className="relative inline-block">
            <button className="text-slate-500 hover:text-indigo-400 transition cursor-pointer p-0.5 rounded-full hover:bg-slate-800">
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Hover Popover Card */}
            <div className="absolute left-0 sm:left-auto sm:-right-12 top-7 hidden group-hover:block z-50 w-80 p-4 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-200 space-y-3 pointer-events-none">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
                <Calculator className="w-4 h-4" />
                <span>Cálculo do Risk Score ({risk.score}/100)</span>
              </div>

              <p className="text-slate-400 leading-relaxed">
                Score baseado em decaimento logarítmico ponderado pela gravidade das falhas:
              </p>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono space-y-1 text-[11px]">
                <div className="flex justify-between text-rose-400">
                  <span>Críticas ({breakdown.criticalCount} × 15)</span>
                  <span>+{breakdown.criticalPts} pts</span>
                </div>
                <div className="flex justify-between text-orange-400">
                  <span>Altas ({breakdown.highCount} × 5)</span>
                  <span>+{breakdown.highPts} pts</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Médias ({breakdown.mediumCount} × 1.5)</span>
                  <span>+{breakdown.mediumPts} pts</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Baixas ({breakdown.lowCount} × 0.5)</span>
                  <span>+{breakdown.lowPts} pts</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-1 mt-1">
                  <span>Impacto Total</span>
                  <span>{weightedImpact} pts</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800">
                <span className="text-slate-300 font-semibold">Fórmula: </span>
                <code className="text-indigo-300 font-mono">100 - 40 × log10(1 + Impacto/10)</code>
                <div className="mt-1 text-emerald-400 font-mono">
                  Result: 100 - 40 × log10(1 + {(weightedImpact / 10).toFixed(1)}) = <strong>{risk.score}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-5xl font-extrabold text-white tracking-tight">{risk.score}</span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
        <div className={`mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full border ${risk.badgeClass}`}>
          {risk.level}
        </div>
      </div>

      <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold text-2xl shadow-inner flex-shrink-0" style={{ borderColor: risk.color, color: risk.color }}>
        {risk.score}
      </div>
    </div>
  );
};
