import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldAlert, Clock, FileCode } from 'lucide-react';
import type { NormalizedReport } from '../../models/normalized.domain';

interface Props {
  report: NormalizedReport;
}

export const ExecutiveMetrics: React.FC<Props> = ({ report }) => {
  const { summary, scannedFilesCount } = report;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
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
        <div className="flex items-center justify-between text-amber-400">
          <span className="text-xs font-medium text-slate-400">Médias</span>
          <ShieldAlert className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.medium}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-indigo-400">
          <span className="text-xs font-medium text-slate-400">Arquivos Analisados</span>
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
