import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LandingPage } from '../src/components/landing/LandingPage';

describe('LandingPage Component', () => {
  it('should render main hero headline and zero-persistence badge', () => {
    render(<React.StrictMode><LandingPage /></React.StrictMode>);

    expect(screen.getByText(/Transforme Scans de Segurança em/i)).toBeDefined();
    expect(screen.getByText(/100% Client-Side SPA/i)).toBeDefined();
    expect(screen.getAllByText(/semgrep.brunoizidorio.com.br/i).length).toBeGreaterThan(0);
  });

  it('should render 3-step workflow guide', () => {
    render(<React.StrictMode><LandingPage /></React.StrictMode>);

    expect(screen.getByText(/Execute o Scan no Terminal/i)).toBeDefined();
    expect(screen.getByText(/Carregue o Relatório JSON/i)).toBeDefined();
    expect(screen.getByText(/Visualize Insights Executivos/i)).toBeDefined();
  });
});
