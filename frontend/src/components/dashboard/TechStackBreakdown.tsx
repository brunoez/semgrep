import React from 'react';
import { Cpu } from 'lucide-react';
import type { TechShare } from '../../models/normalized.domain';
import { sanitizeText } from '../../services/sanitizer.service';

interface Props {
  techDistribution: TechShare[];
}

export const TechStackBreakdown: React.FC<Props> = ({ techDistribution }) => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-300">Tecnologias & Stacks Afetadas</h3>
        </div>

        {techDistribution.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-500">
            Nenhuma tecnologia mapeada nas regras.
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {techDistribution.slice(0, 5).map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{sanitizeText(item.technology)}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.count} achados ({item.percentage}%)</span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.max(5, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 mt-2">
        Mapeamento de riscos por ecossistema de código (ex: Frontend, Backend, Secrets, Docker).
      </p>
    </div>
  );
};
