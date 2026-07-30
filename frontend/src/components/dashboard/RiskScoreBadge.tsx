import React from 'react';
import { HelpCircle, Calculator, ShieldCheck } from 'lucide-react';
import { calculateExecutiveRiskScore } from '../../services/risk.calculator';

interface Props {
  summary: { critical: number; high: number; medium: number; low: number };
}

export const RiskScoreBadge: React.FC<Props> = ({ summary }) => {
  const risk = calculateExecutiveRiskScore(summary);
  const { breakdown, weightedImpact } = risk;

  // SVG Circular Gauge Calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (risk.score / 100) * circumference;

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl relative group">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Executive Security Rating</p>
          
          {/* Help Icon with Hover Card */}
          <div className="relative inline-block">
            <button className="text-slate-500 hover:text-indigo-400 transition cursor-pointer p-0.5 rounded-full hover:bg-slate-800">
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Hover Popover Card */}
            <div className="absolute left-0 sm:left-auto sm:-right-12 top-7 hidden group-hover:block z-50 w-80 p-4 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-200 space-y-3 pointer-events-none">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
                <Calculator className="w-4 h-4" />
                <span>Classificação por Notas (A+ até F)</span>
              </div>

              <p className="text-slate-300 leading-relaxed font-semibold">
                💡 Nota {risk.grade} ({risk.score}/100) • {risk.level}
              </p>

              <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                <div className="text-emerald-400">A+ (97-100 pts)</div>
                <div className="text-emerald-400">A (90-96 pts)</div>
                <div className="text-lime-400">B+ (80-89 pts)</div>
                <div className="text-amber-400">B (70-79 pts)</div>
                <div className="text-yellow-400">C (60-69 pts)</div>
                <div className="text-orange-400">D (50-59 pts)</div>
                <div className="text-rose-400 font-bold col-span-2">F (0-49 pts) - Risco Crítico</div>
              </div>

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
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-5xl font-extrabold text-white tracking-tight">{risk.score}</span>
          <span className="text-sm font-mono text-slate-500">/ 100</span>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Security Rating: Nota {risk.grade}</span>
        </div>

        <div className={`mt-3 inline-block px-3 py-1 text-xs font-bold rounded-full border ${risk.badgeClass}`}>
          {risk.level}
        </div>
      </div>

      {/* SVG Circular Progress Gauge with ONLY Letter Grade Inside */}
      <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          {/* Background Track Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Proportionally Filled Progress Arc */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="8"
            stroke={risk.color}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* ONLY Big Letter Grade Inside Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-extrabold text-3xl leading-none" style={{ color: risk.color }}>
            {risk.grade}
          </span>
        </div>
      </div>
    </div>
  );
};
