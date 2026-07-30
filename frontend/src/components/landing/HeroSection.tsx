import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ShieldCheck, Play, Sparkles } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';

interface Props {
  onLoadSample: () => void;
}

export const HeroSection: React.FC<Props> = ({ onLoadSample }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero-item', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative py-16 md:py-24 bg-slate-950 overflow-hidden">
      {/* Background Radial Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="gsap-hero-item inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-semibold text-slate-300 shadow-xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Client-Side SPA • Zero Backend • Privacy Preserved</span>
          </div>

          {/* Main Headline */}
          <h1 className="gsap-hero-item text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Transforme Scans de Segurança em <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Insights Executivos</span>
          </h1>

          {/* Subheadline */}
          <p className="gsap-hero-item text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Converta relatórios brutos do <code className="text-indigo-300 font-mono text-sm">semgrep scan --json</code> em dashboards executivos com Risk Score (0-100), Mapeamento Radar OWASP Top 10 e Priorização Inteligente diretamente no navegador.
          </p>

          {/* Dual Action Buttons */}
          <div className="gsap-hero-item flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onLoadSample}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/25 border border-indigo-500/50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Ver Exemplo Executivo ao Vivo
            </button>

            <a
              href="#upload-zone"
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition border border-slate-800 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Analisar Meu JSON do Semgrep
            </a>
          </div>
        </div>

        {/* Embedded File Intake Dropzone */}
        <div id="upload-zone" className="gsap-hero-item mt-14 max-w-4xl mx-auto">
          <FileDropzone />
        </div>
      </div>
    </section>
  );
};
