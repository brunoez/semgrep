export type NormalizedSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type PriorityTier = 'P1' | 'P2' | 'P3' | 'P4';

export interface PriorityAnalysis {
  score: number; // 0 to 100
  tier: PriorityTier;
  label: string;
  badgeClass: string;
  isQuickWin: boolean;
  rationale: string;
}

export interface HotspotDirectory {
  directoryPath: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  percentage: number;
}

export interface TechShare {
  technology: string;
  count: number;
  percentage: number;
}

export interface NormalizedFinding {
  id: string;
  checkId: string;
  title: string;
  severity: NormalizedSeverity;
  filePath: string;
  startLine: number;
  endLine: number;
  startCol: number;
  endCol: number;
  message: string;
  codeSnippet: string;
  cwe: string[];
  owasp: string[];
  category: string;
  technology: string[];
  vulnerabilityClass: string[];
  impact?: string;
  confidence?: string;
  remediationHours: number;
  priority: PriorityAnalysis;
}

export interface NormalizedReport {
  version: string;
  scannedFilesCount: number;
  findings: NormalizedFinding[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    p1Count: number;
    quickWinsCount: number;
    totalRemediationHours: number;
    topHotspots: HotspotDirectory[];
    techDistribution: TechShare[];
    availableTechnologies: string[];
  };
}
