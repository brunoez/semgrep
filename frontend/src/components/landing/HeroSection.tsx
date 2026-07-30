import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Play, Upload, Bolt } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';

interface Props {
  onLoadSample: () => void;
}

export const HeroSection: React.FC<Props> = ({ onLoadSample }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-hero-left',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );

      gsap.fromTo(
        '.gsap-hero-right',
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToDropzone = () => {
    const el = document.getElementById('hero-dropzone-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className="relative py-16 md:py-24 bg-slate-950 overflow-hidden">
      {/* Glow Accent Radial Gradient */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-8">
            <div className="gsap-hero-left inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold shadow-lg">
              <Bolt className="w-3.5 h-3.5 text-indigo-400 fill-current" />
              <span className="uppercase tracking-wider">100% Client-Side • Privacy First</span>
            </div>

            <h1 className="gsap-hero-left text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Transforme Scans de Segurança em <span className="text-indigo-400">Insights Executivos</span>
            </h1>

            <p className="gsap-hero-left text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
              Visualize resultados do Semgrep CLI em segundos. Sem nuvem, sem logs persistentes, 100% privado. Gere relatórios de alto nível com Executive Risk Score (0-100) e Mapeamento OWASP sem sair do navegador.
            </p>

            <div className="gsap-hero-left flex flex-wrap gap-4 pt-2">
              <button
                onClick={scrollToDropzone}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 border border-indigo-500/50 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Upload className="w-4 h-4" />
                Analisar Meu JSON
              </button>

              <button
                onClick={onLoadSample}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-xl font-bold text-sm border border-slate-800 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 text-indigo-400 fill-current" />
                Ver Exemplo ao Vivo
              </button>
            </div>
          </div>

          {/* Right Column: Google Stitch Elevated Dropzone Card */}
          <div id="hero-dropzone-card" className="lg:col-span-6 gsap-hero-right">
            <FileDropzone />
          </div>
        </div>
      </div>
    </section>
  );
};
