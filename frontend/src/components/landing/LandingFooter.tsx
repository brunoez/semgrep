import React from 'react';
import { Shield, Github, Globe, Tag } from 'lucide-react';
import packageJson from '../../../package.json';

export const LandingFooter: React.FC = () => {
  const version = packageJson.version;

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-xs mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-white tracking-tight">Semgrep CLI Visualizer</h4>
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm" title="Versão atual da aplicação (automática)">
                <Tag className="w-3 h-3 text-indigo-400" /> v{version}
              </span>
            </div>
            <p className="text-slate-500 mt-0.5">Plataforma Zero-Persistence para Análise Executiva de Riscos</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <Globe className="w-3.5 h-3.5" /> semgrep.brunoizidorio.com.br
          </span>
          <a
            href="https://github.com/semgrep/semgrep"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Github className="w-3.5 h-3.5" /> GitHub Semgrep CLI
          </a>
        </div>

        <div className="text-slate-500 text-right">
          <p>© {new Date().getFullYear()} Bruno Izidorio. Todos os direitos reservados.</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Nenhum dado ou código enviado sai do seu navegador.</p>
        </div>
      </div>
    </footer>
  );
};
