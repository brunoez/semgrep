import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Gauge, Radar, FolderKanban, Cpu, Flame, Code2 } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-value-card', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Gauge,
      title: 'Executive Risk Score (0-100)',
      description: 'Cálculo de risco logarítmico ponderado pela severidade e impacto das falhas, evitando saturação rápida.',
      badge: 'C-Level Metric',
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    },
    {
      icon: Radar,
      title: 'Mapeamento OWASP Top 10 (Radar)',
      description: 'Gráfico visual em radar mapeando categorias OWASP (Injeção, Controle de Acesso, Falhas Criptográficas).',
      badge: 'Standard OWASP',
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
    },
    {
      icon: FolderKanban,
      title: 'Hotspots de Diretórios',
      description: 'Identifica instantaneamente os módulos e pastas do projeto que concentram 80% do débito de segurança.',
      badge: 'Priorização de Módulos',
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    },
    {
      icon: Cpu,
      title: 'Breakdown por Stacks & Tecnologias',
      description: 'Classificação por ecossistemas afetados (Python, JavaScript/TypeScript, Secrets, Docker, Express).',
      badge: 'Multi-Stack',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    },
    {
      icon: Flame,
      title: 'Quick Wins & P1 Urgente',
      description: 'Filtra automaticamente falhas com alto impacto de segurança e baixo tempo estimado de correção (<= 2h).',
      badge: 'Alto ROI de Correção',
      color: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
    },
    {
      icon: Code2,
      title: 'Leitor de Código & Sanitização XSS',
      description: 'Modal para inspeção do trecho de código vulnerável com proteção XSS (DOMPurify) e sintaxe formatada.',
      badge: 'Developer Experience',
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
    },
  ];

  return (
    <section ref={containerRef} className="py-20 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-mono text-indigo-400 font-bold">
            Inteligência de Dados sem Poluição
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Funcionalidades Projetadas para Executivos & Engenharia
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Tudo o que C-Levels e times de segurança precisam para priorizar a remediação de riscos em tempo recorde.
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
