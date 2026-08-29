import React from 'react';
import { FolderKanban, AlertCircle } from 'lucide-react';
import type { HotspotDirectory } from '../../models/normalized.domain';
import { sanitizeText } from '../../services/sanitizer.service';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  hotspots: HotspotDirectory[];
}

export const TopHotspotsCard: React.FC<Props> = ({ hotspots }) => {
  const { t } = useLanguage();

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FolderKanban className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300">{t('topHotspotsTitle')}</h3>
        </div>

        {hotspots.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-500">
            {t('noHotspots')}
          </div>
        ) : (
          <div className="space-y-3.5 mt-2">
            {hotspots.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-medium truncate max-w-[240px]">
                    {sanitizeText(item.directoryPath)}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-sans">
                    {item.criticalCount > 0 && (
                      <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3" /> {item.criticalCount} {t('criticalWord')}
                      </span>
                    )}
                    <span className="text-slate-400">{item.findingCount} {t('findingsWord')} ({item.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.criticalCount > 0
                        ? 'bg-rose-500'
                        : item.highCount > 0
                        ? 'bg-orange-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.max(5, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 mt-2">
        {t('hotspotsFooter')}
      </p>
    </div>
  );
};
