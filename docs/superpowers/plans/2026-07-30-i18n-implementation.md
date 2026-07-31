# Internationalization (i18n) PT-BR & EN-US Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement multi-language support (PT-BR and EN-US) on the existing domain with language switcher flags in the header.

**Architecture:** React Context API + custom `useLanguage` hook managing a strict, type-safe dictionary of translations stored in `localStorage` with browser language auto-detection.

**Tech Stack:** React 18, TypeScript, TailwindCSS, Vitest, Testing Library React.

## Global Constraints

- Never use `dangerouslySetInnerHTML` for translation strings to prevent XSS.
- Validate `localStorage` value against strict allowed languages (`pt-BR` | `en-US`).
- Preserve zero-persistence, client-side security architecture.
- Maintain full test coverage with Vitest for new components.

---

### Task 1: Translations Dictionary & Language Context

**Files:**
- Create: `frontend/src/locales/translations.ts`
- Create: `frontend/src/context/LanguageContext.tsx`
- Test: `frontend/tests/LanguageContext.test.tsx`

**Interfaces:**
- Produces: `useLanguage()` hook returning `{ language: Language, setLanguage: (lang: Language) => void, t: (key: TranslationKey) => string }`
- Produces: `<LanguageProvider>` wrapper component

- [ ] **Step 1: Write failing test for LanguageContext**

```tsx
// frontend/tests/LanguageContext.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { LanguageProvider, useLanguage } from '../src/context/LanguageContext';

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should default to pt-BR or browser language and switch to en-US', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('pt-BR');
    expect(result.current.t('headerTitle')).toBe('Semgrep CLI Visualizer');

    act(() => {
      result.current.setLanguage('en-US');
    });

    expect(result.current.language).toBe('en-US');
    expect(localStorage.getItem('semgrep_app_lang')).toBe('en-US');
  });

  it('should sanitize invalid localStorage values', () => {
    localStorage.setItem('semgrep_app_lang', 'invalid-lang-script-injection');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('pt-BR');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix frontend test tests/LanguageContext.test.tsx`
Expected: FAIL with "Cannot find module '../src/context/LanguageContext'"

- [ ] **Step 3: Implement translations dictionary and LanguageContext**

```typescript
// frontend/src/locales/translations.ts
export type Language = 'pt-BR' | 'en-US';

export const translations = {
  'pt-BR': {
    headerTitle: 'Semgrep CLI Visualizer',
    subtitle: 'Visualizador Executivo Zero-Persistence Client-Side',
    exportPdf: 'Exportar PDF',
    newScan: 'Novo Scan / Início',
    home: 'Página Inicial',
    dropzoneTitle: 'Arraste seu arquivo resultado_semgrep.json aqui',
  },
  'en-US': {
    headerTitle: 'Semgrep CLI Visualizer',
    subtitle: 'Zero-Persistence Client-Side Executive Visualizer',
    exportPdf: 'Export PDF',
    newScan: 'New Scan / Home',
    home: 'Home Page',
    dropzoneTitle: 'Drop your resultado_semgrep.json file here',
  },
} as const;

export type TranslationKey = keyof typeof translations['pt-BR'];
```

```tsx
// frontend/src/context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationKey, translations } from '../locales/translations';

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
    return navigator.language?.startsWith('pt') ? 'pt-BR' : 'en-US';
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix frontend test tests/LanguageContext.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/locales/translations.ts frontend/src/context/LanguageContext.tsx frontend/tests/LanguageContext.test.tsx
git commit -m "feat(i18n): add translations dictionary and LanguageContext with strict validation"
```

---

### Task 2: LanguageSwitcher Component & Header Integration

**Files:**
- Create: `frontend/src/components/common/LanguageSwitcher.tsx`
- Modify: `frontend/src/components/common/Header.tsx`
- Test: `frontend/tests/LanguageSwitcher.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/context/LanguageContext.tsx`
- Produces: `<LanguageSwitcher />` component

- [ ] **Step 1: Write failing test for LanguageSwitcher**

```tsx
// frontend/tests/LanguageSwitcher.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LanguageProvider } from '../src/context/LanguageContext';
import { LanguageSwitcher } from '../src/components/common/LanguageSwitcher';

describe('LanguageSwitcher Component', () => {
  it('should render flag buttons and allow changing language', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const ptButton = screen.getByRole('button', { name: /Português/i });
    const enButton = screen.getByRole('button', { name: /English/i });

    expect(ptButton).toBeDefined();
    expect(enButton).toBeDefined();

    fireEvent.click(enButton);
    expect(localStorage.getItem('semgrep_app_lang')).toBe('en-US');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix frontend test tests/LanguageSwitcher.test.tsx`
Expected: FAIL with "Cannot find module '../src/components/common/LanguageSwitcher'"

- [ ] **Step 3: Implement LanguageSwitcher and integrate into Header**

```tsx
// frontend/src/components/common/LanguageSwitcher.tsx
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
```

- Modify `frontend/src/components/common/Header.tsx` to include `<LanguageSwitcher />` and use `t(...)` for header labels.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix frontend test tests/LanguageSwitcher.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/common/LanguageSwitcher.tsx frontend/src/components/common/Header.tsx frontend/tests/LanguageSwitcher.test.tsx
git commit -m "feat(i18n): integrate LanguageSwitcher in Header"
```

---

### Task 3: Wrap Main Application with LanguageProvider

**Files:**
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/tests/LandingPage.test.tsx`

**Interfaces:**
- Consumes: `<LanguageProvider>` wrapper in `main.tsx` / `App.tsx`

- [ ] **Step 1: Update main.tsx to include LanguageProvider**

Wrap `<App />` with `<LanguageProvider>` inside `src/main.tsx`.

- [ ] **Step 2: Run full test suite**

Run: `npm --prefix frontend test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add frontend/src/main.tsx frontend/src/App.tsx
git commit -m "feat(i18n): wrap root application with LanguageProvider"
```
