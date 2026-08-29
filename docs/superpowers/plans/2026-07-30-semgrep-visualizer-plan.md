# Semgrep CLI Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Security-First, Client-Side SPA Frontend Visualizer and C-Level Dashboard for Semgrep CLI scan findings using React, Vite, TypeScript, Tailwind CSS, Zod, DOMPurify, Recharts, and Vitest.

**Architecture:** A pure client-side architecture where uploaded/pasted Semgrep CLI JSON files are strictly size-checked, validated via Zod schemas, sanitized against XSS attacks, mapped into a normalized security domain model inspired by DefectDojo, and stored in RAM. The UI provides an Executive Risk Score overview, OWASP Top 10 breakdown, remediation effort estimates, and a vulnerability code explorer.

**Tech Stack:** React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Zod 3, DOMPurify 3, Recharts 2, Lucide React, Vitest.

## Global Constraints

- Project root contains `frontend/` (SPA codebase) and `backend/` (reserved). All web app code MUST be created inside `frontend/`.
- 100% Client-Side SPA execution: Zero persistence (no `localStorage`), zero external network dispatch or telemetry.
- OWASP Top 10 Security: All string values (messages, paths, code snippets) MUST be contextually escaped or sanitized with DOMPurify. No `dangerouslySetInnerHTML`.
- Max JSON file size limit: 50MB. Max code snippet display lines: 50 lines surrounding vulnerability.
- Code quality & testing: 100% Vitest coverage on schema validation, DefectDojo adapter, risk calculation engine, and sanitization services.

---

### Task 1: Initialize Vite React Project & Security Dependencies

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/src/index.css`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Test: `frontend/tests/setup.ts`

**Interfaces:**
- Produces: Base Vite + React + TypeScript + Tailwind CSS project with Vitest configuration.

- [ ] **Step 1: Scaffold Vite React TypeScript project inside `frontend/`**

Run in terminal:
```bash
npx -y create-vite@latest frontend --template react-ts
```

- [ ] **Step 2: Install security, styling, charting, and testing dependencies**

Run in terminal:
```bash
cd frontend && npm install zod dompurify recharts lucide-react zustand && npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/dompurify tailwindcss postcss autoprefixer
```

- [ ] **Step 3: Configure Tailwind CSS in `frontend/tailwind.config.js` and `frontend/src/index.css`**

Configure `frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0b0f19',
          800: '#111827',
          700: '#1f2937',
          600: '#374151'
        }
      }
    },
  },
  plugins: [],
}
```

Add directives to `frontend/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-950 text-slate-100 min-h-screen font-sans antialiased;
}
```

- [ ] **Step 4: Configure Vitest in `frontend/vite.config.ts`**

Update `frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
})
```

Create `frontend/tests/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Verify build & test setup**

Run in terminal:
```bash
cd frontend && npm run build && npx vitest run
```
Expected output: Build success, Vitest executes with 0 errors.

- [ ] **Step 6: Commit Task 1**

```bash
git add frontend/
git commit -m "feat: initialize frontend Vite React TypeScript project with security & testing dependencies"
```

---

### Task 2: Implement Zod Schemas & DefectDojo Parser Adapter

**Files:**
- Create: `frontend/src/models/semgrep.schema.ts`
- Create: `frontend/src/models/normalized.domain.ts`
- Create: `frontend/src/services/defectdojo.adapter.ts`
- Test: `frontend/tests/defectdojo.adapter.test.ts`

**Interfaces:**
- Consumes: Raw Semgrep CLI JSON file content (string or object).
- Produces: `parseAndNormalizeSemgrepReport(jsonInput: string): NormalizedReport`

- [ ] **Step 1: Write the failing unit test for parser and Zod schema validation**

Create `frontend/tests/defectdojo.adapter.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseAndNormalizeSemgrepReport } from '../src/services/defectdojo.adapter';

describe('DefectDojo Semgrep Adapter', () => {
  it('should parse valid Semgrep CLI JSON output into normalized domain findings', () => {
    const rawSemgrepJson = JSON.stringify({
      version: '1.45.0',
      results: [
        {
          check_id: 'rules.python.lang.security.deserialization.pickle',
          path: 'app/utils.py',
          start: { line: 42, col: 5 },
          end: { line: 42, col: 25 },
          extra: {
            message: 'Avoid unpickling untrusted data',
            severity: 'ERROR',
            lines: 'data = pickle.loads(user_input)',
            metadata: {
              cwe: ['CWE-502'],
              owasp: ['A08:2021 - Software and Data Integrity Failures'],
              impact: 'HIGH',
              confidence: 'HIGH'
            }
          }
        }
      ]
    });

    const report = parseAndNormalizeSemgrepReport(rawSemgrepJson);

    expect(report.findings).toHaveLength(1);
    expect(report.findings[0].severity).toBe('CRITICAL');
    expect(report.findings[0].checkId).toBe('rules.python.lang.security.deserialization.pickle');
    expect(report.findings[0].filePath).toBe('app/utils.py');
    expect(report.findings[0].cwe).toContain('CWE-502');
    expect(report.findings[0].owasp).toContain('A08:2021 - Software and Data Integrity Failures');
  });

  it('should reject non-JSON or invalid schema input safely', () => {
    expect(() => parseAndNormalizeSemgrepReport('invalid json')).toThrow('Formato de JSON inválido');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run in terminal:
```bash
cd frontend && npx vitest run tests/defectdojo.adapter.test.ts
```
Expected: FAIL ("Cannot find module '../src/services/defectdojo.adapter'")

- [ ] **Step 3: Define Zod Schemas in `frontend/src/models/semgrep.schema.ts`**

Create `frontend/src/models/semgrep.schema.ts`:
```typescript
import { z } from 'zod';

export const SemgrepFindingSchema = z.object({
  check_id: z.string(),
  path: z.string(),
  start: z.object({ line: z.number(), col: z.number() }),
  end: z.object({ line: z.number(), col: z.number() }),
  extra: z.object({
    message: z.string(),
    lines: z.string().optional(),
    severity: z.enum(['ERROR', 'WARNING', 'INFO']).optional(),
    metadata: z.object({
      category: z.string().optional(),
      cwe: z.union([z.string(), z.array(z.string())]).optional(),
      owasp: z.union([z.string(), z.array(z.string())]).optional(),
      impact: z.string().optional(),
      confidence: z.string().optional(),
      likelihood: z.string().optional(),
      vulnerability_class: z.array(z.string()).optional(),
    }).passthrough().optional(),
  }).passthrough(),
});

export const SemgrepReportSchema = z.object({
  version: z.string().optional(),
  results: z.array(SemgrepFindingSchema),
  errors: z.array(z.any()).optional(),
  paths: z.object({
    scanned: z.array(z.string()).optional(),
  }).optional(),
});

export type SemgrepReportInput = z.infer<typeof SemgrepReportSchema>;
```

- [ ] **Step 4: Define Domain Models in `frontend/src/models/normalized.domain.ts`**

Create `frontend/src/models/normalized.domain.ts`:
```typescript
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
```

- [ ] **Step 5: Implement `defectdojo.adapter.ts`**

Create `frontend/src/services/defectdojo.adapter.ts`:
```typescript
import { SemgrepReportSchema } from '../models/semgrep.schema';
import { NormalizedFinding, NormalizedReport, NormalizedSeverity } from '../models/normalized.domain';

function mapSeverity(semgrepSeverity?: string, impact?: string, confidence?: string): NormalizedSeverity {
  if (semgrepSeverity === 'ERROR') {
    if (impact === 'HIGH' && confidence === 'HIGH') return 'CRITICAL';
    return 'HIGH';
  }
  if (semgrepSeverity === 'WARNING') return 'MEDIUM';
  return 'LOW';
}

function calculateRemediationHours(severity: NormalizedSeverity): number {
  switch (severity) {
    case 'CRITICAL': return 8;
    case 'HIGH': return 4;
    case 'MEDIUM': return 2;
    case 'LOW': return 0.5;
    case 'INFO': return 0.25;
  }
}

export function parseAndNormalizeSemgrepReport(jsonString: string): NormalizedReport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Formato de JSON inválido');
  }

  const result = SemgrepReportSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Schema Semgrep inválido: ${result.error.issues[0]?.message || 'Estrutura incorreta'}`);
  }

  const data = result.data;
  const findings: NormalizedFinding[] = data.results.map((item, index) => {
    const meta = item.extra.metadata || {};
    const impact = meta.impact;
    const confidence = meta.confidence;
    const severity = mapSeverity(item.extra.severity, impact, confidence);
    
    const cweList = Array.isArray(meta.cwe) ? meta.cwe : meta.cwe ? [meta.cwe] : [];
    const owaspList = Array.isArray(meta.owasp) ? meta.owasp : meta.owasp ? [meta.owasp] : [];

    return {
      id: `finding-${index}-${item.check_id}`,
      checkId: item.check_id,
      title: item.check_id.split('.').pop() || item.check_id,
      severity,
      filePath: item.path,
      startLine: item.start.line,
      endLine: item.end.line,
      startCol: item.start.col,
      endCol: item.end.col,
      message: item.extra.message,
      codeSnippet: item.extra.lines || '',
      cwe: cweList,
      owasp: owaspList,
      category: meta.category || 'Security',
      impact,
      confidence,
      remediationHours: calculateRemediationHours(severity),
    };
  });

  const summary = findings.reduce(
    (acc, f) => {
      acc.total += 1;
      acc.totalRemediationHours += f.remediationHours;
      if (f.severity === 'CRITICAL') acc.critical += 1;
      else if (f.severity === 'HIGH') acc.high += 1;
      else if (f.severity === 'MEDIUM') acc.medium += 1;
      else if (f.severity === 'LOW') acc.low += 1;
      else acc.info += 1;
      return acc;
    },
    { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0, totalRemediationHours: 0 }
  );

  return {
    version: data.version || 'Unknown',
    scannedFilesCount: data.paths?.scanned?.length || new Set(findings.map(f => f.filePath)).size,
    findings,
    summary,
  };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run in terminal:
```bash
cd frontend && npx vitest run tests/defectdojo.adapter.test.ts
```
Expected output: PASS (2 tests passed).

- [ ] **Step 7: Commit Task 2**

```bash
git add frontend/
git commit -m "feat: implement Semgrep Zod schemas and DefectDojo normalized adapter with unit tests"
```

---

### Task 3: Implement Risk Calculator Engine & DOMPurify Sanitizer

**Files:**
- Create: `frontend/src/services/risk.calculator.ts`
- Create: `frontend/src/services/sanitizer.service.ts`
- Test: `frontend/tests/risk.calculator.test.ts`
- Test: `frontend/tests/sanitizer.service.test.ts`

**Interfaces:**
- Consumes: `NormalizedReport`
- Produces: `calculateExecutiveRiskScore(summary): { score: number, level: string, color: string }`, `sanitizeText(raw: string): string`

- [ ] **Step 1: Write failing test for Risk Calculator & Sanitizer**

Create `frontend/tests/risk.calculator.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateExecutiveRiskScore } from '../src/services/risk.calculator';

describe('Executive Risk Calculator', () => {
  it('should return 100 Low Risk score when 0 vulnerabilities exist', () => {
    const summary = { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0, totalRemediationHours: 0 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(100);
    expect(result.level).toBe('Excelente / Baixo Risco');
  });

  it('should decrease score accurately based on critical and high vulnerabilities', () => {
    const summary = { total: 3, critical: 2, high: 1, medium: 0, low: 0, info: 0, totalRemediationHours: 20 };
    const result = calculateExecutiveRiskScore(summary);
    expect(result.score).toBe(40); // 100 - (2*25 + 1*10) = 40
    expect(result.level).toBe('Risco Crítico');
  });
});
```

Create `frontend/tests/sanitizer.service.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeText } from '../src/services/sanitizer.service';

describe('DOMPurify Sanitizer Service', () => {
  it('should strip malicious script tags from text inputs', () => {
    const dirty = '<script>alert("xss")</script>Hello World';
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('Hello World');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run in terminal:
```bash
cd frontend && npx vitest run tests/risk.calculator.test.ts tests/sanitizer.service.test.ts
```
Expected: FAIL (modules missing).

- [ ] **Step 3: Implement `risk.calculator.ts`**

Create `frontend/src/services/risk.calculator.ts`:
```typescript
export interface RiskScoreResult {
  score: number;
  level: string;
  color: string;
  badgeClass: string;
}

export function calculateExecutiveRiskScore(summary: {
  critical: number;
  high: number;
  medium: number;
  low: number;
}): RiskScoreResult {
  const penalty = (summary.critical * 25) + (summary.high * 10) + (summary.medium * 3) + (summary.low * 1);
  const score = Math.max(0, 100 - penalty);

  if (score >= 90) {
    return { score, level: 'Excelente / Baixo Risco', color: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  }
  if (score >= 70) {
    return { score, level: 'Risco Moderado', color: '#f59e0b', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  }
  if (score >= 50) {
    return { score, level: 'Alto Risco', color: '#f97316', badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
  }
  return { score, level: 'Risco Crítico', color: '#ef4444', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
}
```

- [ ] **Step 4: Implement `sanitizer.service.ts`**

Create `frontend/src/services/sanitizer.service.ts`:
```typescript
import DOMPurify from 'dompurify';

export function sanitizeText(input: string): string {
  if (!input) return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run in terminal:
```bash
cd frontend && npx vitest run tests/risk.calculator.test.ts tests/sanitizer.service.test.ts
```
Expected output: PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add frontend/
git commit -m "feat: implement risk calculator engine and DOMPurify sanitizer with tests"
```

---

### Task 4: Implement In-Memory Reactive Zustand Store & Sample Data

**Files:**
- Create: `frontend/src/store/useSemgrepStore.ts`
- Create: `frontend/public/samples/semgrep-sample-report.json`
- Test: `frontend/tests/useSemgrepStore.test.ts`

**Interfaces:**
- Store State: `report: NormalizedReport | null`, `isLoading: boolean`, `error: string | null`, `loadJson(json: string): void`, `loadSample(): Promise<void>`, `reset(): void`

- [ ] **Step 1: Write failing test for Zustand Store**

Create `frontend/tests/useSemgrepStore.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useSemgrepStore } from '../src/store/useSemgrepStore';

describe('useSemgrepStore (In-Memory)', () => {
  beforeEach(() => {
    useSemgrepStore.getState().reset();
  });

  it('should initialize with null report', () => {
    expect(useSemgrepStore.getState().report).toBeNull();
  });

  it('should load and parse JSON input successfully', () => {
    const rawJson = JSON.stringify({
      version: '1.45.0',
      results: [
        {
          check_id: 'sample.rule',
          path: 'src/app.ts',
          start: { line: 1, col: 1 },
          end: { line: 1, col: 10 },
          extra: { message: 'Sample message', severity: 'WARNING' }
        }
      ]
    });

    useSemgrepStore.getState().loadJson(rawJson);
    expect(useSemgrepStore.getState().report?.findings).toHaveLength(1);
    expect(useSemgrepStore.getState().error).toBeNull();
  });
});
```

- [ ] **Step 2: Create sample JSON file `frontend/public/samples/semgrep-sample-report.json`**

Create `frontend/public/samples/semgrep-sample-report.json`:
```json
{
  "version": "1.45.0",
  "results": [
    {
      "check_id": "javascript.express.security.audit.xss.direct-response-write",
      "path": "server/routes/api.js",
      "start": { "line": 54, "col": 5 },
      "end": { "line": 54, "col": 32 },
      "extra": {
        "message": "User input directly written to response stream without escaping.",
        "severity": "ERROR",
        "lines": "res.write('<div>' + req.query.name + '</div>');",
        "metadata": {
          "cwe": ["CWE-79"],
          "owasp": ["A03:2021 - Injection"],
          "impact": "HIGH",
          "confidence": "HIGH"
        }
      }
    },
    {
      "check_id": "python.lang.security.use-defused-xml",
      "path": "services/parser.py",
      "start": { "line": 12, "col": 1 },
      "end": { "line": 12, "col": 24 },
      "extra": {
        "message": "Standard XML parsers are vulnerable to XML entity expansion attacks (XXE). Use defusedxml.",
        "severity": "WARNING",
        "lines": "import xml.etree.ElementTree as ET",
        "metadata": {
          "cwe": ["CWE-611"],
          "owasp": ["A05:2021 - Security Misconfiguration"],
          "impact": "MEDIUM",
          "confidence": "HIGH"
        }
      }
    }
  ]
}
```

- [ ] **Step 3: Implement `useSemgrepStore.ts`**

Create `frontend/src/store/useSemgrepStore.ts`:
```typescript
import { create } from 'zustand';
import { NormalizedReport } from '../models/normalized.domain';
import { parseAndNormalizeSemgrepReport } from '../services/defectdojo.adapter';

interface SemgrepStoreState {
  report: NormalizedReport | null;
  isLoading: boolean;
  error: string | null;
  loadJson: (jsonContent: string) => void;
  loadSample: () => Promise<void>;
  reset: () => void;
}

export const useSemgrepStore = create<SemgrepStoreState>((set) => ({
  report: null,
  isLoading: false,
  error: null,

  loadJson: (jsonContent: string) => {
    set({ isLoading: true, error: null });
    try {
      if (jsonContent.length > 50 * 1024 * 1024) {
        throw new Error('O arquivo excede o limite de segurança de 50MB.');
      }
      const normalized = parseAndNormalizeSemgrepReport(jsonContent);
      set({ report: normalized, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Erro ao carregar o relatório Semgrep', isLoading: false });
    }
  },

  loadSample: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/samples/semgrep-sample-report.json');
      if (!res.ok) throw new Error('Não foi possível carregar o relatório de exemplo.');
      const text = await res.text();
      const normalized = parseAndNormalizeSemgrepReport(text);
      set({ report: normalized, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Erro ao carregar exemplo', isLoading: false });
    }
  },

  reset: () => set({ report: null, error: null, isLoading: false }),
}));
```

- [ ] **Step 4: Run test to verify it passes**

Run in terminal:
```bash
cd frontend && npx vitest run tests/useSemgrepStore.test.ts
```
Expected output: PASS.

- [ ] **Step 5: Commit Task 4**

```bash
git add frontend/
git commit -m "feat: implement in-memory Zustand store and sample Semgrep report with unit tests"
```

---

### Task 5: Build UI Intake Component (Drag & Drop, Paste & Sample)

**Files:**
- Create: `frontend/src/components/common/Header.tsx`
- Create: `frontend/src/components/common/FileDropzone.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/tests/FileDropzone.test.tsx`

- [ ] **Step 1: Create `Header.tsx`**

Create `frontend/src/components/common/Header.tsx`:
```tsx
import React from 'react';
import { ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import { useSemgrepStore } from '../../store/useSemgrepStore';

export const Header: React.FC = () => {
  const { report, reset } = useSemgrepStore();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">Semgrep Executive Dashboard</h1>
          <p className="text-xs text-slate-400">Visualizador Client-Side Seguro de Scan CLI</p>
        </div>
      </div>

      {report && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <FileText className="w-4 h-4" /> Exportar Relatório
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Novo Scan
          </button>
        </div>
      )}
    </header>
  );
};
```

- [ ] **Step 2: Create `FileDropzone.tsx`**

Create `frontend/src/components/common/FileDropzone.tsx`:
```tsx
import React, { useState } from 'react';
import { UploadCloud, Code, Play, AlertCircle } from 'lucide-react';
import { useSemgrepStore } from '../../store/useSemgrepStore';

export const FileDropzone: React.FC = () => {
  const { loadJson, loadSample, error, isLoading } = useSemgrepStore();
  const [pasteText, setPasteText] = useState('');
  const [showPaste, setShowPaste] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) loadJson(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Carregar Relatório do Semgrep CLI</h2>
        <p className="text-sm text-slate-400 mt-2">
          Selecione o arquivo JSON gerado pelo comando <code className="text-indigo-400 bg-slate-800 px-2 py-0.5 rounded">semgrep scan --json</code>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-10 text-center transition cursor-pointer bg-slate-950/40"
      >
        <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <p className="text-base text-slate-200 font-medium">Arraste e solte seu arquivo JSON aqui</p>
        <p className="text-xs text-slate-500 mt-1">Limite máximo: 50MB (Execução 100% no navegador)</p>

        <label className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg cursor-pointer transition shadow-lg shadow-indigo-600/20">
          Procurar Arquivo
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </label>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={() => setShowPaste(!showPaste)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <Code className="w-4 h-4" /> {showPaste ? 'Ocultar Área de Texto' : 'Colar JSON Diretamente'}
        </button>

        <button
          onClick={() => loadSample()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" /> Carregar Relatório de Exemplo
        </button>
      </div>

      {showPaste && (
        <div className="mt-6">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Cole aqui o conteúdo JSON do Semgrep CLI..."
            className="w-full h-40 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={() => pasteText && loadJson(pasteText)}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 transition"
          >
            Processar JSON Colado
          </button>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 3: Connect UI in `App.tsx`**

Update `frontend/src/App.tsx`:
```tsx
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
```

- [ ] **Step 4: Verify build & tests**

Run in terminal:
```bash
cd frontend && npm run build && npx vitest run
```
Expected output: PASS with 0 build errors.

- [ ] **Step 5: Commit Task 5**

```bash
git add frontend/
git commit -m "feat: build file dropzone, paste drawer, and header components"
```

---

### Task 6: Implement C-Level Executive Dashboard (Metrics & Charts)

**Files:**
- Create: `frontend/src/components/dashboard/ExecutiveMetrics.tsx`
- Create: `frontend/src/components/dashboard/RiskScoreBadge.tsx`
- Create: `frontend/src/components/dashboard/SeverityChart.tsx`
- Create: `frontend/src/components/dashboard/OwaspRadarChart.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create `RiskScoreBadge.tsx`**

Create `frontend/src/components/dashboard/RiskScoreBadge.tsx`:
```tsx
import React from 'react';
import { calculateExecutiveRiskScore } from '../../services/risk.calculator';

interface Props {
  summary: { critical: number; high: number; medium: number; low: number };
}

export const RiskScoreBadge: React.FC<Props> = ({ summary }) => {
  const risk = calculateExecutiveRiskScore(summary);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Executive Risk Score</p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-5xl font-extrabold text-white tracking-tight">{risk.score}</span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
        <div className={`mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full border ${risk.badgeClass}`}>
          {risk.level}
        </div>
      </div>
      <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold text-2xl" style={{ borderColor: risk.color, color: risk.color }}>
        {risk.score}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Create `ExecutiveMetrics.tsx`**

Create `frontend/src/components/dashboard/ExecutiveMetrics.tsx`:
```tsx
import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldAlert, Clock, FileCode } from 'lucide-react';
import { NormalizedReport } from '../../models/normalized.domain';

interface Props {
  report: NormalizedReport;
}

export const ExecutiveMetrics: React.FC<Props> = ({ report }) => {
  const { summary, scannedFilesCount } = report;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-rose-400">
          <span className="text-xs font-medium text-slate-400">Críticas</span>
          <AlertOctagon className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.critical}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-orange-400">
          <span className="text-xs font-medium text-slate-400">Altas</span>
          <AlertTriangle className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.high}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-amber-400">
          <span className="text-xs font-medium text-slate-400">Médias</span>
          <ShieldAlert className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.medium}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-indigo-400">
          <span className="text-xs font-medium text-slate-400">Arquivos Analisados</span>
          <FileCode className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{scannedFilesCount}</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-emerald-400">
          <span className="text-xs font-medium text-slate-400">Esforço Estimado</span>
          <Clock className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{summary.totalRemediationHours}h</p>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Create `SeverityChart.tsx` and `OwaspRadarChart.tsx` with Recharts**

Create `frontend/src/components/dashboard/SeverityChart.tsx`:
```tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  summary: { critical: number; high: number; medium: number; low: number; info: number };
}

export const SeverityChart: React.FC<Props> = ({ summary }) => {
  const data = [
    { name: 'Crítica', value: summary.critical, color: '#ef4444' },
    { name: 'Alta', value: summary.high, color: '#f97316' },
    { name: 'Média', value: summary.medium, color: '#f59e0b' },
    { name: 'Baixa', value: summary.low, color: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-80">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Distribuição por Severidade</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
```

Create `frontend/src/components/dashboard/OwaspRadarChart.tsx`:
```tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { NormalizedFinding } from '../../models/normalized.domain';

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
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-80">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Categorias OWASP Top 10 Mapeadas</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-xs text-slate-500">Nenhuma tag OWASP encontrada no relatório.</div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="category" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
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
```

- [ ] **Step 4: Update `App.tsx` with Executive Dashboard Layout**

Update `frontend/src/App.tsx`:
```tsx
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
```

- [ ] **Step 5: Commit Task 6**

```bash
git add frontend/
git commit -m "feat: build executive risk score badge, metrics and Recharts dashboard components"
```

---

### Task 7: Implement Vulnerability Explorer & Code Viewer Modal

**Files:**
- Create: `frontend/src/components/explorer/VulnerabilityTable.tsx`
- Create: `frontend/src/components/explorer/CodeViewerModal.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create `CodeViewerModal.tsx`**

Create `frontend/src/components/explorer/CodeViewerModal.tsx`:
```tsx
import React from 'react';
import { X, ShieldAlert, FileCode } from 'lucide-react';
import { NormalizedFinding } from '../../models/normalized.domain';
import { sanitizeText } from '../../services/sanitizer.service';

interface Props {
  finding: NormalizedFinding | null;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<Props> = ({ finding, onClose }) => {
  if (!finding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <ShieldAlert className="w-6 h-6 text-rose-400" />
          <div>
            <h3 className="text-base font-bold text-white">{sanitizeText(finding.title)}</h3>
            <p className="text-xs text-slate-400 font-mono">{sanitizeText(finding.checkId)}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Arquivo: </span>
            <span className="text-indigo-400 font-mono">{sanitizeText(finding.filePath)}:{finding.startLine}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Descrição: </span>
            <p className="text-slate-200 mt-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
              {sanitizeText(finding.message)}
            </p>
          </div>

          {finding.codeSnippet && (
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <FileCode className="w-4 h-4" />
                <span>Trecho de Código Vulnerável:</span>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-400 overflow-x-auto text-xs">
                <code>{sanitizeText(finding.codeSnippet)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Create `VulnerabilityTable.tsx`**

Create `frontend/src/components/explorer/VulnerabilityTable.tsx`:
```tsx
import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { NormalizedFinding } from '../../models/normalized.domain';
import { sanitizeText } from '../../services/sanitizer.service';

interface Props {
  findings: NormalizedFinding[];
  onSelectFinding: (finding: NormalizedFinding) => void;
}

export const VulnerabilityTable: React.FC<Props> = ({ findings, onSelectFinding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filtered = findings.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.filePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.checkId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || f.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-base font-bold text-white">Explorer de Vulnerabilidades ({filtered.length})</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar regra, arquivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Todas Severidades</option>
            <option value="CRITICAL">Crítica</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Média</option>
            <option value="LOW">Baixa</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-3">Severidade</th>
              <th className="p-3">Regra (Check ID)</th>
              <th className="p-3">Arquivo & Linha</th>
              <th className="p-3">OWASP</th>
              <th className="p-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((f) => (
              <tr key={f.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-bold">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    f.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    f.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    f.severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {f.severity}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-200">{sanitizeText(f.title)}</td>
                <td className="p-3 font-mono text-indigo-400">{sanitizeText(f.filePath)}:{f.startLine}</td>
                <td className="p-3 text-slate-400">{f.owasp[0] || 'N/A'}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onSelectFinding(f)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Integrate Vulnerability Explorer into `App.tsx`**

Update `frontend/src/App.tsx`:
```tsx
import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { FileDropzone } from './components/common/FileDropzone';
import { RiskScoreBadge } from './components/dashboard/RiskScoreBadge';
import { ExecutiveMetrics } from './components/dashboard/ExecutiveMetrics';
import { SeverityChart } from './components/dashboard/SeverityChart';
import { OwaspRadarChart } from './components/dashboard/OwaspRadarChart';
import { VulnerabilityTable } from './components/explorer/VulnerabilityTable';
import { CodeViewerModal } from './components/explorer/CodeViewerModal';
import { NormalizedFinding } from './models/normalized.domain';
import { useSemgrepStore } from './store/useSemgrepStore';

export const App: React.FC = () => {
  const { report } = useSemgrepStore();
  const [selectedFinding, setSelectedFinding] = useState<NormalizedFinding | null>(null);

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

            <VulnerabilityTable findings={report.findings} onSelectFinding={setSelectedFinding} />

            <CodeViewerModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
```

- [ ] **Step 4: Verify build and full test execution**

Run in terminal:
```bash
cd frontend && npm run build && npx vitest run
```
Expected output: Build success, all unit tests PASS.

- [ ] **Step 5: Commit Task 7**

```bash
git add frontend/
git commit -m "feat: implement vulnerability explorer table and code viewer modal component"
```

---

### Task 8: End-to-End Verification & Documentation

**Files:**
- Create: `frontend/README.md`
- Test: All Vitest suites

- [ ] **Step 1: Execute full test suite and build verification**

Run in terminal:
```bash
cd frontend && npm run build && npx vitest run
```
Expected output: All test suites PASS, production build succeeds.

- [ ] **Step 2: Create `frontend/README.md`**

Create `frontend/README.md`:
```markdown
# Semgrep CLI Frontend Visualizer & C-Level Dashboard

Dashboard executivo e visualizador de resultados do **Semgrep CLI**, 100% client-side, focado em segurança (OWASP Top 10 safe), performance e insights para C-Levels.

## Tecnologias
- **React 18 + Vite + TypeScript**
- **Tailwind CSS** (Dark Mode executivo)
- **Zod & DOMPurify** (Validação rigorosa e prevenção de XSS)
- **Recharts** (Gráficos interativos)
- **Vitest** (Testes unitários e de segurança)

## Como Rodar Localmente
```bash
cd frontend
npm install
npm run dev
```

## Como Rodar os Testes
```bash
npm run test
```
```

- [ ] **Step 3: Commit Task 8**

```bash
git add frontend/
git commit -m "docs: add frontend documentation and verify clean build"
```
