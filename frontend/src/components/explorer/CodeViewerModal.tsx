import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ShieldAlert, FileCode, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import type { NormalizedFinding } from '../../models/normalized.domain';
import { sanitizeText } from '../../services/sanitizer.service';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  finding: NormalizedFinding | null;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<Props> = ({ finding, onClose }) => {
  const { t } = useLanguage();
  const [activeFinding, setActiveFinding] = useState<NormalizedFinding | null>(finding);
  const isClosingRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync incoming finding prop with activeFinding
  useEffect(() => {
    if (finding) {
      setActiveFinding(finding);
      isClosingRef.current = false;
    }
  }, [finding]);

  // Handle animated close via GSAP
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (overlayRef.current && modalRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.94,
        y: 15,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setActiveFinding(null);
          onClose();
          isClosingRef.current = false;
        },
      });
    } else {
      setActiveFinding(null);
      onClose();
      isClosingRef.current = false;
    }
  }, [onClose]);

  // GSAP Entrance animation whenever activeFinding is present
  useEffect(() => {
    if (activeFinding && overlayRef.current && modalRef.current) {
      gsap.killTweensOf([overlayRef.current, modalRef.current]);
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.2)' }
      );
    }
  }, [activeFinding]);

  // Close modal when ESC key is pressed
  useEffect(() => {
    if (!activeFinding) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFinding, handleClose]);

  if (!activeFinding) return null;

  const getPriorityLabel = (tier: string) => {
    switch (tier) {
      case 'P1': return t('p1Label');
      case 'P2': return t('p2Label');
      case 'P3': return t('p3Label');
      case 'P4': default: return t('p4Label');
    }
  };

  const getTranslatedRationale = (rationale: string) => {
    const parts: string[] = [];
    if (rationale.includes('Severidade Crítica') || rationale.includes('Critical Severity')) parts.push(t('ratCriticalSev'));
    if (rationale.includes('OWASP')) parts.push(t('ratHighOwasp'));
    if (rationale.includes('Quick Win')) parts.push(t('ratQuickWin'));
    return parts.join(' • ') || t('ratDefault');
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          aria-label={t('closeModal')}
          title={t('closeModal')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white">{sanitizeText(activeFinding.title)}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeFinding.priority.badgeClass}`}>
                {activeFinding.priority.tier} (Score {activeFinding.priority.score}/100)
              </span>
              {activeFinding.priority.isQuickWin && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-semibold">
                  <Sparkles className="w-3 h-3" /> Quick Win
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{sanitizeText(activeFinding.checkId)}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400 font-medium">{t('fileAndLine')} </span>
              <span className="text-indigo-400 font-mono block mt-0.5">{sanitizeText(activeFinding.filePath)}:{activeFinding.startLine}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">{t('smartPrioritization')} </span>
              <span className="text-slate-200 font-sans block mt-0.5">{getPriorityLabel(activeFinding.priority.tier)}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">{t('priorityRationale')} </span>
            <p className="text-slate-300 mt-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-sans text-xs">
              {sanitizeText(getTranslatedRationale(activeFinding.priority.rationale))}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">{t('vulnerabilityDesc')} </span>
            <p className="text-slate-200 mt-1 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
              {sanitizeText(activeFinding.message)}
            </p>
          </div>

          {activeFinding.codeSnippet && (
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <FileCode className="w-4 h-4" />
                <span>{t('codeViewerTitle')}</span>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-400 overflow-x-auto text-xs leading-relaxed max-h-60 overflow-y-auto">
                <code>{sanitizeText(activeFinding.codeSnippet)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
