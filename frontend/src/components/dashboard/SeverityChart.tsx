import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  summary: { critical: number; high: number; medium: number; low: number; info: number };
}

export const SeverityChart: React.FC<Props> = ({ summary }) => {
  const { t } = useLanguage();

  const data = [
    { name: t('critical'), value: summary.critical, color: '#ef4444' },
    { name: t('high'), value: summary.high, color: '#f97316' },
    { name: t('medium'), value: summary.medium, color: '#f59e0b' },
    { name: t('low'), value: summary.low, color: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-80 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">{t('severityDistribution')}</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-xs text-slate-500">
          {t('noVulnerabilities')}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              labelStyle={{ color: '#f8fafc' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
