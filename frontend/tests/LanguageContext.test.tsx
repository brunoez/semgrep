import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { LanguageProvider, useLanguage } from '../src/context/LanguageContext';

describe('LanguageContext', () => {
  const originalLanguage = navigator.language;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: originalLanguage,
      configurable: true,
    });
  });

  it('should auto-detect browser language as en-US when navigator.language starts with en and localStorage is empty', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('en-US');
  });

  it('should auto-detect browser language as pt-BR when navigator.language does not start with en and localStorage is empty', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'pt-BR',
      configurable: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('pt-BR');
    expect(result.current.t('headerTitle')).toBe('Semgrep CLI Visualizer');
  });

  it('should allow switching language manually and save to localStorage', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'pt-BR',
      configurable: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('pt-BR');

    act(() => {
      result.current.setLanguage('en-US');
    });

    expect(result.current.language).toBe('en-US');
    expect(localStorage.getItem('semgrep_app_lang')).toBe('en-US');
  });

  it('should prioritize valid localStorage saved language over browser language', () => {
    localStorage.setItem('semgrep_app_lang', 'pt-BR');
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('pt-BR');
  });

  it('should sanitize invalid localStorage values and fallback to auto-detection', () => {
    localStorage.setItem('semgrep_app_lang', 'invalid-lang-script-injection');
    Object.defineProperty(navigator, 'language', {
      value: 'pt-BR',
      configurable: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('pt-BR');
  });
});
