import React, { useState } from 'react';
import { Upload, Clipboard, Play, AlertCircle } from 'lucide-react';
import { useSemgrepStore } from '../../store/useSemgrepStore';
import { useLanguage } from '../../context/LanguageContext';

export const FileDropzone: React.FC = () => {
  const { loadJson, loadSample, isLoading, error } = useSemgrepStore();
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  const readFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      alert(t('jsonErrorAlert'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      loadJson(content);
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) return;
    loadJson(pasteContent);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all bg-slate-900/80 backdrop-blur-md cursor-pointer ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_25px_rgba(99,102,241,0.2)]'
            : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
        }`}
      >
        <input
          type="file"
          accept=".json"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="w-16 h-16 mb-4 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          {t('dropzoneTitle').replace(' semgrep.json', '')} <code className="text-indigo-400 font-mono">semgrep.json</code>
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mb-6">
          {t('dropzoneSubtitle')}
        </p>

        {/* CLI Terminal snippet */}
        <div className="w-full bg-slate-950 rounded-xl p-3.5 font-mono text-[11px] text-slate-400 border border-slate-800 text-left mb-4 z-20 pointer-events-auto">
          <div className="flex gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
          </div>
          <span className="text-emerald-400">$</span> semgrep scan --json &gt; results.json
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={() => setPasteOpen(!pasteOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
            {pasteOpen ? t('closePasteBtn') : t('pasteJsonBtn')}
          </button>

          <button
            type="button"
            onClick={loadSample}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/30 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            {t('loadSampleBtn')}
          </button>
        </div>

        {pasteOpen && (
          <div className="w-full mt-4 z-20 pointer-events-auto text-left space-y-2">
            <textarea
              rows={4}
              placeholder={t('pastePlaceholder')}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handlePasteSubmit}
              disabled={isLoading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              {isLoading ? t('pasteLoading') : t('pasteSubmitBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
