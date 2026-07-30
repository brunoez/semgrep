import React from 'react';
import { Header } from './components/common/Header';
import { FileDropzone } from './components/common/FileDropzone';
import { RiskScoreBadge } from './components/dashboard/RiskScoreBadge';
import { ExecutiveMetrics } from './components/dashboard/ExecutiveMetrics';
import { SeverityChart } from './components/dashboard/SeverityChart';
import { OwaspRadarChart } from './components/dashboard/OwaspRadarChart';
import { useSemgrepStore } from './store/useSemgrepStore';

export const App: React.FC = () => {
  const { report } = useSemgrepStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {!report ? (
          <FileDropzone />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <RiskScoreBadge summary={report.summary} />
              </div>
              <div className="lg:col-span-2 flex items-center">
                <ExecutiveMetrics report={report} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SeverityChart summary={report.summary} />
              <OwaspRadarChart findings={report.findings} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
