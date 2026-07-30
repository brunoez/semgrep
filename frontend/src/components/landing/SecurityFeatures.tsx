import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ShieldCheck, Lock, Cpu } from 'lucide-react';

export const SecurityFeatures: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-sec-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const guarantees = [
    {
      icon: ShieldCheck,
      title: '100% Client-Side Execution',
      description:
        'Execução totalmente isolada na memória RAM da sua aba. Nenhum dado, vulnerabilidade ou código do seu repositório é enviado para servidores externos.',
      highlight: 'Zero Telemetria • Zero Backend',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      icon: Lock,
      title: 'OWASP Safe & XSS Protection',
      description:
        'Validação rigorosa de tipos com schemas Zod e sanitização completa de strings vulneráveis com DOMPurify para prevenção de XSS.',
      highlight: 'Schema Validated',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    },
    {
      icon: Cpu,
      title: 'DefectDojo Engine Alignment',
      description:
        'Modelo de normalização compatível com os padrões de AppSec corporativos do OWASP DefectDojo para consolidação de relatórios.',
      highlight: 'Standard AppSec Model',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
  ];

  return (
    <section ref={containerRef} className="py-16 bg-slate-950 border-t border-b border-slate-800/80">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
            Garantias de Privacidade & Segurança
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Privacidade Absoluta para Ambientes Corporativos Sensíveis
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
