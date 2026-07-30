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
