import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { NormalizedFinding } from '../../models/normalized.domain';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  findings: NormalizedFinding[];
}

export const OwaspRadarChart: React.FC<Props> = ({ findings }) => {
  const { t } = useLanguage();

  // Pre-initialize OWASP Top 10 categories to show uniform radar web
  const owaspCounts: Record<string, number> = {
    'A01:Broken Access': 0,
    'A02:Crypto Failures': 0,
    'A03:Injection': 0,
    'A04:Insecure Design': 0,
    'A05:Misconfig': 0,
    'A06:Vulnerable Components': 0,
    'A07:Auth Failures': 0,
    'A08:Integrity Failures': 0,
    'A09:Logging Failures': 0,
    'A10:SSRF': 0,
  };

  findings.forEach((f) => {
    f.owasp.forEach((cat) => {
      if (cat.includes('A01') || cat.includes('Access Control')) owaspCounts['A01:Broken Access'] += 1;
      else if (cat.includes('A02') || cat.includes('Cryptographic')) owaspCounts['A02:Crypto Failures'] += 1;
      else if (cat.includes('A03') || cat.includes('Injection')) owaspCounts['A03:Injection'] += 1;
      else if (cat.includes('A04') || cat.includes('Insecure Design')) owaspCounts['A04:Insecure Design'] += 1;
      else if (cat.includes('A05') || cat.includes('Misconfiguration')) owaspCounts['A05:Misconfig'] += 1;
      else if (cat.includes('A06') || cat.includes('Vulnerable')) owaspCounts['A06:Vulnerable Components'] += 1;
      else if (cat.includes('A07') || cat.includes('Authentication')) owaspCounts['A07:Auth Failures'] += 1;
      else if (cat.includes('A08') || cat.includes('Integrity')) owaspCounts['A08:Integrity Failures'] += 1;
      else if (cat.includes('A09') || cat.includes('Logging')) owaspCounts['A09:Logging Failures'] += 1;
      else if (cat.includes('A10') || cat.includes('SSRF')) owaspCounts['A10:SSRF'] += 1;
      else {
        const shortName = cat.split('-')[0].trim();
        owaspCounts[shortName] = (owaspCounts[shortName] || 0) + 1;
      }
    });
  });

  const data = Object.entries(owaspCounts).map(([category, count]) => ({
    category,
    count,
  }));

  const hasData = findings.some(f => f.owasp.length > 0);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-80 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-300 mb-2">{t('owaspRadarTitle')}</h3>
      {!hasData ? (
        <div className="flex items-center justify-center h-56 text-xs text-slate-500">
          {t('noOwaspTags')}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <PolarRadiusAxis stroke="#475569" angle={30} tick={{ fontSize: 9 }} />
            <Radar name={t('vulnerabilitiesWord')} dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#818cf8' }}
              labelStyle={{ color: '#f8fafc' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
