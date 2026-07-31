import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Language, type TranslationKey, translations } from '../locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY = 'semgrep_app_lang';
const ALLOWED_LANGUAGES: Language[] = ['pt-BR', 'en-US'];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ALLOWED_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
    return (typeof navigator !== 'undefined' && navigator.language?.startsWith('en')) ? 'en-US' : 'pt-BR';
  });

  const setLanguage = (lang: Language) => {
    if (ALLOWED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : 'en';
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'pt-BR' ? 'pt-BR' : 'en';
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['pt-BR'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
};
