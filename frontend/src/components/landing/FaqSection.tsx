import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Os dados do meu arquivo JSON de scan são enviados para algum servidor?',
    answer: 'Não, de forma alguma. Toda a leitura, validação de schema Zod, normalização DefectDojo e renderização gráfica ocorrem 100% no seu próprio navegador (client-side SPA). O código-fonte e as vulnerabilidades nunca deixam a memória RAM da sua aba.',
  },
  {
    question: 'Como faço para gerar o arquivo JSON com o Semgrep CLI?',
    answer: 'Basta executar no terminal da sua aplicação o comando oficial do Semgrep exportando o resultado em formato JSON: semgrep scan --json > resultado_semgrep.json.',
  },
  {
    question: 'Quais versões e esquemas do Semgrep são suportados?',
    answer: 'Suportamos nativamente a estrutura oficial do Semgrep CLI (incluindo versões com severidades CRITICAL, HIGH, MEDIUM, LOW, ERROR e WARNING, além de regras comunitárias e Pro rules).',
  },
  {
    question: 'O que é o Executive Risk Score e como ele é calculado?',
    answer: 'É uma métrica de 0 a 100 desenhada para executivos (C-Levels). Ela combina o impacto ponderado de vulnerabilidades críticas, altas, médias e baixas através de uma curva de decaimento logarítmico, evitando saturação rápida em grandes projetos.',
  },
  {
    question: 'Existe algum limite de tamanho para o arquivo JSON carregado?',
    answer: 'Como o processamento é feito pela engine JavaScript do seu navegador, suportamos relatórios de até 50MB ou milhares de vulnerabilidades com renderização fluida.',
  },
];

export const FaqSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-faq-item', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={containerRef} className="py-20 bg-slate-950 border-t border-slate-800/80">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Dúvidas Frequentes
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes & Conformidade
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Entenda por que o Semgrep CLI Visualizer é seguro para uso em ambientes corporativos sensíveis.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="gsap-faq-item bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 text-sm hover:text-indigo-400 transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
