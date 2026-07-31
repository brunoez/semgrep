import React from 'react';
import { ShieldCheck, RefreshCw, FileText, Home } from 'lucide-react';
import { useSemgrepStore } from '../../store/useSemgrepStore';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Props {
  onGoHome?: () => void;
}

export const Header: React.FC<Props> = ({ onGoHome }) => {
  const { report, reset } = useSemgrepStore();
  const { t } = useLanguage();

  const handleReset = () => {
    reset();
    if (onGoHome) onGoHome();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div
        onClick={handleReset}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 group-hover:border-indigo-500/50 transition">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {t('headerTitle')}
            <span className="text-[10px] font-mono font-normal text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              semgrep.brunoizidorio.com.br
            </span>
          </h1>
          <p className="text-xs text-slate-400">{t('subtitle')}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {report ? (
          <>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" /> {t('exportPdf')}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> {t('newScan')}
            </button>
          </>
        ) : (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-indigo-400" /> {t('home')}
          </button>
        )}
      </div>
    </header>
  );
};
