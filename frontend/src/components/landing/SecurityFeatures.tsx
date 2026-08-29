import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ShieldCheck, Lock, Cpu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SecurityFeatures: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-sec-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const guarantees = [
    {
      icon: ShieldCheck,
      title: t('sec1Title'),
      description: t('sec1Desc'),
      highlight: t('sec1Highlight'),
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      icon: Lock,
      title: t('sec2Title'),
      description: t('sec2Desc'),
      highlight: t('sec2Highlight'),
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    },
    {
      icon: Cpu,
      title: t('sec3Title'),
      description: t('sec3Desc'),
      highlight: t('sec3Highlight'),
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
  ];

  return (
    <section ref={containerRef} className="py-16 bg-slate-950 border-t border-b border-slate-800/80">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
            {t('secFeaturesBadge')}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {t('secFeaturesTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guarantees.map((g, idx) => {
            const IconComponent = g.icon;
            return (
              <div
                key={idx}
                className="gsap-sec-card bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${g.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      {g.highlight}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{g.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
