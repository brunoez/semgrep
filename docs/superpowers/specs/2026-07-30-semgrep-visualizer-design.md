# Specification Design: Semgrep CLI Frontend Visualizer & C-Level Dashboard

**Date:** 2026-07-30  
**Status:** Approved Draft  
**Target Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Recharts + Zod + DOMPurify + Vitest  

---

## 1. Executive Summary & Core Objective

The goal of this project is to build a **Security-First, High-Performance, Client-Side Dashboard and Visualizer** for Semgrep CLI JSON scan reports. 

The application is tailored for **C-Level Executives (CISO, CTO, VP of Engineering)** and **Security Engineers**, converting raw Semgrep CLI output into actionable security metrics, executive risk scoring, OWASP Top 10 compliance mapping, remediation effort estimates, and a vulnerability code explorer.

### Key Guarantees
- **Zero Backend / Data Storage:** 100% client-side SPA. No scan findings are persisted on any server, database, or external telemetry service.
- **Security-First Engineering:** Native protection against OWASP Top 10 web vulnerabilities (No XSS, No Prototype Pollution, No DoS/OOM via oversized payloads).
- **DefectDojo Parser Alignment:** Parsing logic follows the standardized Semgrep parser data model used by OWASP DefectDojo.

---

## 2. Technical Stack & Architecture

### 2.1 Core Stack
| Layer | Technology | Rationale |
|---|---|---|
| **Framework & Build Tool** | React 18 + Vite | Fast HMR, lightweight SPA bundle, optimal performance |
| **Language** | TypeScript (Strict Mode) | Type safety, strict interface declarations, compile-time error prevention |
| **Styling & UI** | Tailwind CSS + Glassmorphic Design | Modern, dark-mode focused C-Level aesthetics, responsive layout |
| **Data Validation** | Zod | Runtime schema validation of untrusted JSON payloads |
| **Sanitization** | DOMPurify | XSS prevention for dynamic text and metadata |
| **Data Visualization** | Recharts | Rich, interactive C-Level charts (Severity, OWASP Radar, CWE distribution) |
| **Icons** | Lucide React | Clean, scalable icon system |
| **Testing** | Vitest + Testing Library | Unit tests for parser, security rules, and components |

### 2.2 System Architecture Overview

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              CLIENT BROWSER                            │
 ├────────────────────────────────────────────────────────────────────────┤
 │  [ Input Layer ]                                                       │
 │   - Drag & Drop JSON Upload (Max 50MB)                                 │
 │   - Direct Paste JSON Text Area                                       │
 │   - Pre-loaded Sample Semgrep Scan Reports                              │
 └─────────────────┬──────────────────────────────────────────────────────┘
                   │
                   ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │  [ Security & Parsing Engine ]                                          │
 │   1. File Size & Type Validation                                       │
 │   2. JSON Parse + Zod Schema Validation (SemgrepReportSchema)          │
 │   3. Sanitization Layer (DOMPurify)                                    │
 │   4. DefectDojo Semgrep Adapter (Raw JSON -> Normalized Domain Model)   │
 └─────────────────┬──────────────────────────────────────────────────────┘
                   │
                   ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │  [ In-Memory Reactive State Store ] (Zustand / Context)                │
 │   - Raw Scan Metadata                                                  │
 │   - Normalized Findings Collection                                     │
 │   - Executive Metrics & Calculated Risk Scores                         │
 └─────────────────┬──────────────────────────────────────────────────────┘
                   │
                   ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │  [ UI Presentation Layer ]                                             │
 │   - Executive Overview (Risk Score, Metrics Cards, OWASP Breakdown)    │
 │   - Vulnerability Explorer (Grid, Multi-Filters, Code Viewer)          │
 │   - Remediation & Compliance Matrix                                    │
 │   - Executive PDF / Print Report Exporter                              │
 └────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Directory & File Hierarchy

```
Semgrep front/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-07-30-semgrep-visualizer-design.md
├── frontend/                     # Aplicativo Frontend SPA (React + Vite + TS)
│   ├── public/
│   │   ├── samples/              # Relatórios JSON de exemplo do Semgrep CLI
│   │   │   └── semgrep-sample-report.json
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/               # Estilos globais e ícones
│   │   ├── components/           # Componentes de Interface de Usuário
│   │   │   ├── common/           # Componentes reutilizáveis (Header, Modais, Dropzone)
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── FileDropzone.tsx
│   │   │   ├── dashboard/        # Painel Executivo C-Level
│   │   │   │   ├── ExecutiveMetrics.tsx
│   │   │   │   ├── RiskScoreBadge.tsx
│   │   │   │   ├── SeverityChart.tsx
│   │   │   │   ├── OwaspRadarChart.tsx
│   │   │   │   └── TopVulnerableComponents.tsx
│   │   │   ├── explorer/         # Tabela e Leitor de Vulnerabilidades
│   │   │   │   ├── VulnerabilityTable.tsx
│   │   │   │   ├── VulnerabilityFilters.tsx
│   │   │   │   └── CodeViewerModal.tsx
│   │   │   └── export/           # Gerador de Relatório Executivo para Impressão/PDF
│   │   │       └── ExecutiveReportPdf.tsx
│   │   ├── models/               # Schemas Zod e Interfaces TypeScript
│   │   │   ├── semgrep.schema.ts
│   │   │   └── normalized.domain.ts
│   │   ├── services/             # Adaptadores, Sanitizadores e Cálculo de Risco
│   │   │   ├── defectdojo.adapter.ts
│   │   │   ├── risk.calculator.ts
│   │   │   └── sanitizer.service.ts
│   │   ├── store/                # Estado Reativo em RAM (Sem persistência local)
│   │   │   └── useSemgrepStore.ts
│   │   ├── App.tsx               # Roteador / Gerenciador de Telas
│   │   ├── index.css             # Estilos Tailwind e Tokens Visuais
│   │   └── main.tsx              # Ponto de Entrada React
│   ├── tests/                    # Testes Unitários e de Segurança (Vitest)
│   │   ├── defectdojo.adapter.test.ts
│   │   ├── risk.calculator.test.ts
│   │   ├── semgrep.schema.test.ts
│   │   └── sanitizer.service.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── backend/                      # Diretório mantido para expansões futuras (se aplicável)
```

---

## 3. Security Specification (Security by Design)

In strict adherence to the **Security-First AI Agent** guidelines and OWASP Top 10 mitigations:

### 3.1 Input Validation & Schema Enforcement (Zod)
- All uploaded or pasted JSON data must pass through `SemgrepOutputSchema` built with **Zod**.
- Unexpected properties are stripped or safely handled to prevent **Prototype Pollution**.
- Malformed or incomplete JSON structures trigger clear, generic client-side error notifications without leaking stack traces.

### 3.2 Cross-Site Scripting (XSS) Prevention
- All user-supplied data (such as code snippets, file paths, rule messages, and metadata strings) are rendered strictly using React text nodes (`{finding.message}`) or safe escaped blocks.
- **Forbidden Patterns:** `dangerouslySetInnerHTML`, `eval()`, `new Function()`, direct `innerHTML` mutations are strictly prohibited.
- For any rich text or Markdown metadata rendering, **DOMPurify** sanitization is mandated before DOM insertion.

### 3.3 Denial of Service (DoS) & Memory Safety
- **File Size Cap:** Enforced hard limit of **50 MB** per JSON file input.
- **Graceful Truncation:** Code snippets rendered in the UI are capped at 50 lines surrounding the target vulnerability to ensure smooth DOM rendering regardless of file size.

### 3.4 Zero-Persistence & Data Privacy
- Findings reside solely in browser RAM during the active session.
- No `localStorage` or `sessionStorage` persistence for finding details, ensuring zero artifact residue on shared or multi-user workstations.
- No external network requests (No telemetry, no Google Analytics, no remote API calls).

---

## 4. DefectDojo-Inspired Data Model & Parser Specification

The parser converts raw Semgrep CLI output into a standardized, normalized domain model inspired by DefectDojo's `dojo/tools/semgrep/parser.py`.

### 4.1 Semgrep CLI JSON Structure (Input Schema)
```typescript
export const SemgrepFindingSchema = z.object({
  check_id: z.string(),
  path: z.string(),
  start: z.object({ line: z.number(), col: z.number() }),
  end: z.object({ line: z.number(), col: z.number() }),
  extra: z.object({
    message: z.string(),
    metavars: z.record(z.any()).optional(),
    metadata: z.object({
      category: z.string().optional(),
      cwe: z.union([z.string(), z.array(z.string())]).optional(),
      owasp: z.union([z.string(), z.array(z.string())]).optional(),
      impact: z.string().optional(),
      confidence: z.string().optional(),
      likelihood: z.string().optional(),
      severity: z.string().optional(),
      shortlink: z.string().optional(),
      technology: z.array(z.string()).optional(),
      vulnerability_class: z.array(z.string()).optional(),
    }).passthrough().optional(),
    severity: z.enum(['ERROR', 'WARNING', 'INFO']).optional(),
    lines: z.string().optional(),
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
```

### 4.2 Normalized Finding (Domain Model)
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
  likelihood?: string;
  remediationHours: number;
}
```

### 4.3 Severity Mapping Matrix
Semgrep CLI reports severity under `extra.severity` or `extra.metadata.severity` as `ERROR`, `WARNING`, or `INFO`. The adapter maps these to C-Level standard severities using impact/confidence metadata:

| Semgrep Severity | Metadata Impact / Confidence | Mapped C-Level Severity | Remediation Weight (Hours) |
|---|---|---|---|
| `ERROR` | Impact: HIGH / Confidence: HIGH | **CRITICAL** | 8h |
| `ERROR` | Standard / Default | **HIGH** | 4h |
| `WARNING` | Standard / Default | **MEDIUM** | 2h |
| `INFO` | Standard / Default | **LOW** / **INFO** | 0.5h |

---

## 5. Executive C-Level Analytics & Insights Engine

The visualizer calculates real-time insights based on the parsed findings:

### 5.1 Executive Risk Score Algorithm (0 - 100)
Calculated using a normalized inverse log formula based on findings density and severity weights:
$$Score = 100 - \min\left(100, \sum (Count_{Critical} \times 25 + Count_{High} \times 10 + Count_{Medium} \times 3 + Count_{Low} \times 1)\right)$$
- **90 - 100:** Low Risk (Green)
- **70 - 89:** Moderate Risk (Yellow)
- **50 - 69:** High Risk (Orange)
- **0 - 49:** Critical Risk (Red)

### 5.2 C-Level Metrics Dashboard Modules
1. **Executive Summary Header:** Total Findings, Executive Risk Score Badge, Files Scanned, Total Estimated Remediation Effort (Person-Hours).
2. **Severity Distribution:** Donut & Bar charts highlighting Critical vs High findings.
3. **OWASP Top 10 Mapping:** Radar chart / Horizontal bar graph showing vulnerability density per OWASP category (e.g., A01:2021-Broken Access Control, A03:2021-Injection).
4. **Top Vulnerable Components:** Directory and File tree risk heatmap.
5. **Remediation Cost Estimate:** Developer effort breakdown by team/category.

---

## 6. UI & UX Architecture

### 6.1 Views & Component Layout
1. **Intake View (`/`)**:
   - Drag-and-Drop file dropzone with visual animation.
   - Raw JSON paste drawer with auto-formatting.
   - Quick action: "Load Sample Semgrep Report" (for instant demo/testing).
2. **Main Dashboard (`/dashboard`)**:
   - Tab 1: **Executive Overview** (Charts, Key Metrics, Risk Score, Remediation Matrix).
   - Tab 2: **Vulnerability Explorer** (Interactive data table with search, multi-faceted filtering by severity, OWASP, CWE, and file path).
   - Tab 3: **Compliance & OWASP Matrix** (Deep dive into OWASP Top 10 alignment).
3. **Vulnerability Detail & Code Viewer Modal**:
   - Displays vulnerability details, OWASP/CWE references, Semgrep check ID, remediation guidance, and code snippet with line highlight.
4. **Export Engine**:
   - One-click PDF / Print Executive Briefing generator.

---

## 7. Testing & Quality Assurance Plan

- **Unit Tests (Vitest):**
  - Validation of Zod schema parsing against valid Semgrep CLI outputs.
  - Rejection tests for corrupted, malicious, or oversized JSON inputs.
  - Precision check for the Executive Risk Score calculation algorithm.
  - Sanitization tests verifying XSS payload neutrality in `DOMPurify` wrappers.
- **Component Tests:**
  - Rendering verification for File Intake, Dashboard Views, and Code Viewer.

---

## 8. Development Phases & Plan

1. **Phase 1: Project Setup & Security Foundation**
   - Initialize Vite + React + TypeScript + Tailwind CSS project in root directory.
   - Configure Vitest, ESLint, Zod, DOMPurify, Recharts, Lucide.
2. **Phase 2: Parser & Data Engine**
   - Build Zod Schemas & DefectDojo Semgrep Adapter.
   - Write comprehensive unit tests for parser and risk scoring.
3. **Phase 3: Executive Dashboard & UI Components**
   - Implement Intake View (Drag & Drop, Paste, Samples).
   - Build Executive Overview, Risk Score badge, OWASP & Severity charts.
4. **Phase 4: Vulnerability Explorer & Code Reader**
   - Implement data table with sorting, search, and filtering.
   - Build secure code snippet viewer component.
5. **Phase 5: Exporting, Verification & Polish**
   - Executive PDF print stylesheet.
   - Full suite of security and unit tests validation.

---

## 9. Verification & Pre-Commit Checklist

- [x] Input validation with Zod configured
- [x] OWASP Top 10 security guidelines addressed
- [x] Zero-persistence & memory-only data handling guaranteed
- [x] Executable Vitest test plan defined
- [x] Responsive, dark-mode executive UI designed
