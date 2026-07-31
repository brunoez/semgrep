import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Gauge, Radar, FolderKanban, Cpu, Flame, Code2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ValueProps: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-value-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Gauge,
      title: t('vp1Title'),
      description: t('vp1Desc'),
      badge: t('vp1Badge'),
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    },
    {
      icon: Radar,
      title: t('vp2Title'),
      description: t('vp2Desc'),
      badge: t('vp2Badge'),
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
    },
    {
      icon: FolderKanban,
      title: t('vp3Title'),
      description: t('vp3Desc'),
      badge: t('vp3Badge'),
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    },
    {
      icon: Cpu,
      title: t('vp4Title'),
      description: t('vp4Desc'),
      badge: t('vp4Badge'),
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    },
    {
      icon: Flame,
      title: t('vp5Title'),
      description: t('vp5Desc'),
      badge: t('vp5Badge'),
      color: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
    },
    {
      icon: Code2,
      title: t('vp6Title'),
      description: t('vp6Desc'),
      badge: t('vp6Badge'),
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
    },
  ];

  return (
    <section ref={containerRef} className="py-20 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-mono text-indigo-400 font-bold">
            {t('valuePropsBadge')}
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            {t('valuePropsTitle')}
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            {t('valuePropsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const IconComponent = f.icon;
            return (
              <div
                key={idx}
                className="gsap-value-card bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${f.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
