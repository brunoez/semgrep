import { parseAndNormalizeSemgrepReport } from '../services/defectdojo.adapter';
import { calculateExecutiveRiskScore } from '../services/risk.calculator';
import { useSemgrepStore } from '../store/useSemgrepStore';

declare global {
  interface Navigator {
    modelContext?: {
      provideContext?: (context: {
        tools: Array<{
          name: string;
          description: string;
          inputSchema: object;
          execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
        }>;
      }) => void;
    };
  }
}

/**
 * Initializes WebMCP in-browser tools API (navigator.modelContext.provideContext)
 * Exposes WebMCP capabilities to AI agents natively in browser context.
 */
export function registerWebMcpTools() {
  if (typeof window === 'undefined' || !navigator.modelContext?.provideContext) {
    return;
  }

  try {
    navigator.modelContext.provideContext({
      tools: [
        {
          name: 'analyze_semgrep_report',
          description: 'Parses a Semgrep CLI JSON raw string, normalizes vulnerabilities, and populates Executive Risk Score and OWASP metrics.',
          inputSchema: {
            type: 'object',
            properties: {
              reportContent: { type: 'string', description: 'Raw Semgrep CLI JSON output string' }
            },
            required: ['reportContent']
          },
          execute: async ({ reportContent }) => {
            const content = String(reportContent);
            const report = parseAndNormalizeSemgrepReport(content);
            const risk = calculateExecutiveRiskScore(report.summary);
            useSemgrepStore.setState({ report, isLoading: false, error: null });
            return {
              success: true,
              totalFindings: report.summary.total,
              executiveRiskScore: risk.score,
              riskGrade: risk.grade,
              riskLevel: risk.level,
              severityDistribution: {
                critical: report.summary.critical,
                high: report.summary.high,
                medium: report.summary.medium,
                low: report.summary.low,
                info: report.summary.info
              }
            };
          }
        },
        {
          name: 'get_executive_risk_score',
          description: 'Returns the current loaded Semgrep report Executive Risk Score, grade, and vulnerability breakdown.',
          inputSchema: {
            type: 'object',
            properties: {}
          },
          execute: () => {
            const report = useSemgrepStore.getState().report;
            if (!report) {
              return { error: 'No Semgrep report currently loaded' };
            }
            const risk = calculateExecutiveRiskScore(report.summary);
            return {
              executiveRiskScore: risk.score,
              riskGrade: risk.grade,
              riskLevel: risk.level,
              totalFindings: report.summary.total,
              severityDistribution: {
                critical: report.summary.critical,
                high: report.summary.high,
                medium: report.summary.medium,
                low: report.summary.low,
                info: report.summary.info
              },
              topHotspots: report.summary.topHotspots
            };
          }
        }
      ]
    });
  } catch (err) {
    console.warn('WebMCP registration notice:', err);
  }
}
