import React from 'react';
import { AlertOctagon, AlertTriangle, Clock, FileCode, Flame, Sparkles } from 'lucide-react';
import type { NormalizedReport } from '../../models/normalized.domain';

interface Props {
  report: NormalizedReport;
}

export const ExecutiveMetrics: React.FC<Props> = ({ report }) => {
  const { summary, scannedFilesCount } = report;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 w-full">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-rose-500">
          <span className="text-xs font-medium text-slate-400">P1 Urgente</span>
          <Flame className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.p1Count}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-emerald-400">
          <span className="text-xs font-medium text-slate-400">Quick Wins</span>
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.quickWinsCount}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-rose-400">
          <span className="text-xs font-medium text-slate-400">Críticas</span>
          <AlertOctagon className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.critical}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-orange-400">
          <span className="text-xs font-medium text-slate-400">Altas</span>
          <AlertTriangle className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.high}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-indigo-400">
          <span className="text-xs font-medium text-slate-400">Arquivos Scaneados</span>
          <FileCode className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{scannedFilesCount}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-emerald-400">
          <span className="text-xs font-medium text-slate-400">Esforço Estimado</span>
          <Clock className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.totalRemediationHours}h</p>
      </div>
    </div>
  );
};
