export type NormalizedSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

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
  impact?: string;
  confidence?: string;
  remediationHours: number;
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
    totalRemediationHours: number;
  };
}
