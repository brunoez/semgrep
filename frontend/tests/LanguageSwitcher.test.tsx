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
