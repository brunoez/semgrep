import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { NormalizedFinding } from '../../models/normalized.domain';

interface Props {
  findings: NormalizedFinding[];
}

export const OwaspRadarChart: React.FC<Props> = ({ findings }) => {
  const owaspCounts: Record<string, number> = {};

  findings.forEach((f) => {
    f.owasp.forEach((cat) => {
      const shortName = cat.split('-')[0].trim();
      owaspCounts[shortName] = (owaspCounts[shortName] || 0) + 1;
    });
  });

  const data = Object.entries(owaspCounts).map(([category, count]) => ({ category, count }));

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-80 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Categorias OWASP Top 10 Mapeadas</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-xs text-slate-500">
          Nenhuma tag OWASP encontrada no relatório.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="category" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
