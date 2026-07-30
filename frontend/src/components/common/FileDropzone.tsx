import React, { useState } from 'react';
import { UploadCloud, Code, Play, AlertCircle } from 'lucide-react';
import { useSemgrepStore } from '../../store/useSemgrepStore';

export const FileDropzone: React.FC = () => {
  const { loadJson, loadSample, error, isLoading } = useSemgrepStore();
  const [pasteText, setPasteText] = useState('');
  const [showPaste, setShowPaste] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) loadJson(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Carregar Relatório do Semgrep CLI</h2>
        <p className="text-sm text-slate-400 mt-2">
          Selecione o arquivo JSON gerado pelo comando <code className="text-indigo-400 bg-slate-800 px-2 py-0.5 rounded">semgrep scan --json</code>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-10 text-center transition cursor-pointer bg-slate-950/40"
      >
        <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <p className="text-base text-slate-200 font-medium">Arraste e solte seu arquivo JSON aqui</p>
        <p className="text-xs text-slate-500 mt-1">Limite máximo: 50MB (Execução 100% no navegador)</p>

        <label className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg cursor-pointer transition shadow-lg shadow-indigo-600/20">
          Procurar Arquivo
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </label>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={() => setShowPaste(!showPaste)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <Code className="w-4 h-4" /> {showPaste ? 'Ocultar Área de Texto' : 'Colar JSON Diretamente'}
        </button>

        <button
          onClick={() => loadSample()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" /> Carregar Relatório de Exemplo
        </button>
      </div>

      {showPaste && (
        <div className="mt-6">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Cole aqui o conteúdo JSON do Semgrep CLI..."
            className="w-full h-40 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={() => pasteText && loadJson(pasteText)}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 transition"
          >
            Processar JSON Colado
          </button>
        </div>
      )}
    </div>
  );
};
