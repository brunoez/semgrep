import React from 'react';
import { ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import { useSemgrepStore } from '../../store/useSemgrepStore';

export const Header: React.FC = () => {
  const { report, reset } = useSemgrepStore();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">Semgrep Executive Dashboard</h1>
          <p className="text-xs text-slate-400">Visualizador Client-Side Seguro de Scan CLI</p>
        </div>
      </div>

      {report && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <FileText className="w-4 h-4" /> Exportar Relatório
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Novo Scan
          </button>
        </div>
      )}
    </header>
  );
};
