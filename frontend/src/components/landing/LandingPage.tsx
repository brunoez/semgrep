import React from 'react';
import { HeroSection } from './HeroSection';
import { SecurityFeatures } from './SecurityFeatures';
import { ValueProps } from './ValueProps';
import { HowItWorks } from './HowItWorks';
import { FaqSection } from './FaqSection';
import { LandingFooter } from './LandingFooter';
import { useSemgrepStore } from '../../store/useSemgrepStore';

export const LandingPage: React.FC = () => {
  const { loadSample } = useSemgrepStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <HeroSection onLoadSample={loadSample} />
        <SecurityFeatures />
        <ValueProps />
        <HowItWorks />
        <FaqSection />
      </div>
      <LandingFooter />
    </div>
  );
};
