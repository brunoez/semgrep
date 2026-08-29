import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Terminal, Upload, BarChart3, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-step-card',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      step: '01',
      icon: Terminal,
      title: t('step1Title'),
      description: t('step1Desc'),
      code: 'semgrep scan --json > resultado_semgrep.json',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    },
    {
      step: '02',
      icon: Upload,
      title: t('step2Title'),
      description: t('step2Desc'),
      code: 'semgrep.brunoizidorio.com.br',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      step: '03',
      icon: BarChart3,
      title: t('step3Title'),
      description: t('step3Desc'),
      code: t('step3Code'),
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
  ];

  return (
    <section ref={containerRef} className="py-20 bg-slate-950 border-t border-slate-800/80">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-mono text-indigo-400 font-bold">
            {t('howItWorksBadge')}
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={idx}
                className="gsap-step-card bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative flex flex-col justify-between group hover:border-indigo-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${s.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-700 font-mono group-hover:text-indigo-400 transition-colors">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{s.description}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="truncate">{s.code}</span>
                  {idx < 2 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden md:block" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
