import React from 'react';
import { Header } from './components/common/Header';
import { FileDropzone } from './components/common/FileDropzone';
import { useSemgrepStore } from './store/useSemgrepStore';

export const App: React.FC = () => {
  const { report } = useSemgrepStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="container mx-auto px-6 py-6">
        {!report ? (
          <FileDropzone />
        ) : (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-xl font-bold">Relatório Carregado com Sucesso!</h2>
            <p className="text-sm text-slate-400 mt-2">Versão: {report.version} | Total de Achados: {report.summary.total}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
