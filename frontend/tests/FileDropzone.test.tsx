import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { FileDropzone } from '../src/components/common/FileDropzone';
import { LanguageProvider } from '../src/context/LanguageContext';
import { useSemgrepStore } from '../src/store/useSemgrepStore';

describe('FileDropzone Component - Defensive MIME & Extension Validation', () => {
  beforeEach(() => {
    localStorage.setItem('semgrep_app_lang', 'pt-BR');
    useSemgrepStore.setState({ report: null, error: null, isLoading: false });
    vi.restoreAllMocks();
  });

  it('should reject files with invalid extensions and trigger alert', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { container } = render(
      <LanguageProvider>
        <FileDropzone />
      </LanguageProvider>
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const fakeFile = new File(['fake content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [fakeFile] } });

    expect(alertMock).toHaveBeenCalledWith('Por favor, envie um arquivo com extensão .json');
    expect(useSemgrepStore.getState().report).toBeNull();
  });

  it('should defensively reject files with .json extension but dangerous binary MIME types', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { container } = render(
      <LanguageProvider>
        <FileDropzone />
      </LanguageProvider>
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const fakeBinaryFile = new File(['MZ binary executable payload'], 'malicious.json', {
      type: 'application/x-msdownload',
    });

    fireEvent.change(input, { target: { files: [fakeBinaryFile] } });

    expect(alertMock).toHaveBeenCalledWith('Por favor, envie um arquivo com extensão .json');
    expect(useSemgrepStore.getState().report).toBeNull();
  });

  it('should accept files with .json extension and application/json MIME type', async () => {
    const validJsonContent = JSON.stringify({
      version: '1.0.0',
      results: [],
      paths: { scanned: ['app.ts'] },
    });

    const { container } = render(
      <LanguageProvider>
        <FileDropzone />
      </LanguageProvider>
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = new File([validJsonContent], 'semgrep.json', {
      type: 'application/json',
    });

    fireEvent.change(input, { target: { files: [validFile] } });

    // Wait for FileReader onload to execute
    await vi.waitFor(() => {
      expect(useSemgrepStore.getState().report).not.toBeNull();
    });
  });
});
