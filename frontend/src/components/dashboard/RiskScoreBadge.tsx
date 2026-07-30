import React from 'react';
import { calculateExecutiveRiskScore } from '../../services/risk.calculator';

interface Props {
  summary: { critical: number; high: number; medium: number; low: number };
}

export const RiskScoreBadge: React.FC<Props> = ({ summary }) => {
  const risk = calculateExecutiveRiskScore(summary);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Executive Risk Score</p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-5xl font-extrabold text-white tracking-tight">{risk.score}</span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
        <div className={`mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full border ${risk.badgeClass}`}>
          {risk.level}
        </div>
      </div>
      <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold text-2xl shadow-inner" style={{ borderColor: risk.color, color: risk.color }}>
        {risk.score}
      </div>
    </div>
  );
};
