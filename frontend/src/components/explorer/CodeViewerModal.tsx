import React from 'react';
import { X, ShieldAlert, FileCode, Sparkles } from 'lucide-react';
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
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{sanitizeText(finding.title)}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${finding.priority.badgeClass}`}>
                {finding.priority.tier} (Score {finding.priority.score}/100)
              </span>
              {finding.priority.isQuickWin && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-semibold">
                  <Sparkles className="w-3 h-3" /> Quick Win
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{sanitizeText(finding.checkId)}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400 font-medium">Arquivo & Linha: </span>
              <span className="text-indigo-400 font-mono block mt-0.5">{sanitizeText(finding.filePath)}:{finding.startLine}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Priorização Inteligente: </span>
              <span className="text-slate-200 font-sans block mt-0.5">{finding.priority.label}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Justificativa da Prioridade: </span>
            <p className="text-slate-300 mt-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-sans text-xs">
              {sanitizeText(finding.priority.rationale)}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Descrição da Vulnerabilidade: </span>
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
