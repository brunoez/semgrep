import React from 'react';
import { X, ShieldAlert, FileCode } from 'lucide-react';
import type { NormalizedFinding } from '../../models/normalized.domain';
import { sanitizeText } from '../../services/sanitizer.service';

interface Props {
  finding: NormalizedFinding | null;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<Props> = ({ finding, onClose }) => {
  if (!finding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0" />
          <div>
            <h3 className="text-base font-bold text-white">{sanitizeText(finding.title)}</h3>
            <p className="text-xs text-slate-400 font-mono">{sanitizeText(finding.checkId)}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Arquivo: </span>
            <span className="text-indigo-400 font-mono">{sanitizeText(finding.filePath)}:{finding.startLine}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Descrição: </span>
            <p className="text-slate-200 mt-1 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
              {sanitizeText(finding.message)}
            </p>
          </div>

          {finding.codeSnippet && (
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <FileCode className="w-4 h-4" />
                <span>Trecho de Código Vulnerável:</span>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-400 overflow-x-auto text-xs leading-relaxed">
                <code>{sanitizeText(finding.codeSnippet)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
