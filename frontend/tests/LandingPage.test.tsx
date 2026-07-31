import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LandingPage } from '../src/components/landing/LandingPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('LandingPage Component', () => {
  beforeEach(() => {
    localStorage.setItem('semgrep_app_lang', 'pt-BR');
  });

  it('should render main hero headline and zero-persistence badge', () => {
    render(
      <React.StrictMode>
        <LanguageProvider>
          <LandingPage />
        </LanguageProvider>
      </React.StrictMode>
    );

    expect(screen.getByText(/Transforme Scans de Segurança em/i)).toBeDefined();
    expect(screen.getAllByText(/100% CLIENT-SIDE/i).length).toBeGreaterThan(0);
  });

  it('should render 3-step workflow guide', () => {
    render(
      <React.StrictMode>
        <LanguageProvider>
          <LandingPage />
        </LanguageProvider>
      </React.StrictMode>
    );

    expect(screen.getByText(/Execute o Scan no Terminal/i)).toBeDefined();
    expect(screen.getByText(/Carregue o Relatório JSON/i)).toBeDefined();
    expect(screen.getByText(/Visualize Insights Executivos/i)).toBeDefined();
  });
});
