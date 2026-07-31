import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
      <button
        onClick={() => setLanguage('pt-BR')}
        className={`px-2 py-1 text-xs rounded transition flex items-center gap-1 cursor-pointer ${
          language === 'pt-BR'
            ? 'bg-indigo-600 text-white font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Português (Brasil)"
        title="Português (BR)"
      >
        <span>🇧🇷</span>
        <span className="hidden sm:inline">PT</span>
      </button>
      <button
        onClick={() => setLanguage('en-US')}
        className={`px-2 py-1 text-xs rounded transition flex items-center gap-1 cursor-pointer ${
          language === 'en-US'
            ? 'bg-indigo-600 text-white font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="English (US)"
        title="English (US)"
      >
        <span>🇺🇸</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
};
