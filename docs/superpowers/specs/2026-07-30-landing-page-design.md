# Specification Design: Semgrep CLI Visualizer Landing Page & Product Showcase

**Date:** 2026-07-30  
**Status:** Approved Specification  
**Target Domain:** `semgrep.brunoizidorio.com.br`  
**Target Stack:** React 18 + Vite + TypeScript + Tailwind CSS (Glassmorphism) + Lucide React + Vitest  
**Reference Handoff Document:** `docs/handoff_completo_semgrep_visualizer.md`

---

## 1. Executive Summary & Product Vision

The goal of this specification is to define the design, user experience, component architecture, and security guidelines for the **Product Landing Page** of the **Semgrep CLI Visualizer** (`semgrep.brunoizidorio.com.br`).

When users navigate to `semgrep.brunoizidorio.com.br`, instead of encountering a plain file upload input, they will be greeted by a **Cybersecurity Dark Mode Landing Page** tailored for **CISOs, CTOs, VPs of Engineering, Security Engineers, and DevOps leaders**.

### Core Value Proposition
- **Transform Raw CLI Scans into C-Level Intelligence:** Converts verbose `semgrep scan --json` outputs into executive risk scores (0-100), OWASP Top 10 radar mapping, top hotspot directory heatmaps, tech stack distributions, and prioritized remediation actions.
- **Zero-Persistence & 100% Data Privacy Guarantee:** Runs completely client-side inside browser RAM. No findings, code snippets, or repositories are ever transmitted to any external server, database, or telemetry service.
- **OWASP Top 10 & DefectDojo Parser Alignment:** Runtime Zod schema validation (`semgrep.schema.ts`) and DOMPurify XSS sanitization matching OWASP DefectDojo data models.

---

## 2. Design System & Visual Tokens

In alignment with the handoff specification (`docs/handoff_completo_semgrep_visualizer.md`):

### 2.1 Color Palette
| Token | Hex Code | Tailwind Class | Application |
|---|---|---|---|
| **Background** | `#020617` | `bg-slate-950` | Body & primary viewport container |
| **Surface (Cards)** | `#0F172A` | `bg-slate-900` | Section cards & glassmorphic containers |
| **Borders** | `#1E293B` | `border-slate-800` | Card borders, dividers, subtle outlines |
| **Primary Accent** | `#6366F1` | `text-indigo-500` / `bg-indigo-600` | Key CTA buttons, active states, brand icons |
| **Critical Severity** | `#F43F5E` | `text-rose-500` / `bg-rose-500/10` | Critical badges, P1 alert highlights |
| **High / Medium Severity** | `#F59E0B` | `text-amber-500` / `bg-amber-500/10` | High/Medium warnings, hotspot progress |
| **Success / Security** | `#10B981` | `text-emerald-500` / `bg-emerald-500/10` | Zero-persistence guarantee badges, Quick Wins |

### 2.2 Aesthetics & Glassmorphism
- **Glassmorphic Cards:** `bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl`
- **Typography:**
  - *UI Text & Headings:* Inter / System Sans (`font-sans`, `tracking-tight`)
  - *CLI Commands & Code Snippets:* Monospace (`font-mono`, Consolas/JetBrains Mono)

---

## 3. Section Architecture & User Journey

The landing page consists of 5 core sections structured to educate, reassure security leaders, and facilitate instant report analysis:

```
┌────────────────────────────────────────────────────────────────────────┐
│  [ Top Bar / Header ] Marca semgrep.brunoizidorio.com.br & Ações Nav   │
├────────────────────────────────────────────────────────────────────────┤
│  [ Section 1: Hero Banner ]                                            │
│   - Headline: "Transforme Scans de Segurança em Insights Executivos"  │
│   - Subheadline & Value Proposition                                   │
│   - Dual CTA Buttons: [ Carregar Relatório JSON ] & [ Ver Exemplo ]    │
│   - Embedded Drag & Drop Zone (Com opção de colar JSON)                │
├────────────────────────────────────────────────────────────────────────┤
│  [ Section 2: Security & Zero-Persistence Badges (3 Colunas) ]        │
│   - 100% Client-Side Execution (RAM only, 0 Backend)                  │
│   - OWASP Safe (Strict Zod + DOMPurify XSS Protection)                 │
│   - DefectDojo Parser Engine (Normalização Inteligente)                │
├────────────────────────────────────────────────────────────────────────┤
│  [ Section 3: C-Level Feature Showcase Grid (3 Colunas) ]             │
│   - Executive Risk Scoring (Formula Logarítmica 0-100)                │
│   - OWASP Top 10 Radar & Hotspots Heatmap                             │
│   - Priorização Inteligente de Remedios (P1 -> P4 & Quick Wins)       │
├────────────────────────────────────────────────────────────────────────┤
│  [ Section 4: Workflow Guia 3 Passos (Terminal -> Browser -> Report) ]  │
│   1. CLI: semgrep scan --json > report.json                            │
│   2. Browser: Arraste e solte o arquivo em semgrep.brunoizidorio.com.br│
│   3. Dashboard: Visualize o Score, Gráfico Radar e Exportação PDF      │
├────────────────────────────────────────────────────────────────────────┤
│  [ Section 5: FAQ & Rodapé de Marca ]                                  │
│   - Perguntas frequentes de segurança e conformidade                   │
│   - Links para o GitHub e Copyright Bruno Izidorio                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Hierarchy & File Structure

```
frontend/src/
├── components/
│   ├── landing/                  # Componentes da Landing Page
│   │   ├── LandingPage.tsx       # Container Principal da Landing View
│   │   ├── HeroSection.tsx       # Banner Hero com Headlines e Dropzone
│   │   ├── SecurityFeatures.tsx  # Grid 3 Colunas de Garantias de Segurança
│   │   ├── ValueProps.tsx        # Grid de Funcionalidades C-Level
│   │   ├── HowItWorks.tsx        # Guia em 3 Passos (CLI -> Browser -> Dashboard)
│   │   ├── FaqSection.tsx        # Perguntas Frequentes de Segurança
│   │   └── LandingFooter.tsx     # Rodapé com Links e Domínio
│   ├── common/
│   │   ├── Header.tsx            # Header Sticky com alternância de visão (Landing <-> Dashboard)
│   │   └── FileDropzone.tsx      # Área de Upload de JSON / Paste / Exemplo
│   ├── dashboard/                # Painel de Gráficos e Métricas Executivas
│   └── explorer/                 # Tabela e Leitor de Vulnerabilidades
└── App.tsx                       # Gerenciador de estado e roteamento de telas
```

---

## 5. Screen Navigation State Machine (`App.tsx`)

The application state manages the active screen mode:

- **State `view`**: `'landing'` | `'dashboard'`
- **Default State**: `'landing'` when opening `semgrep.brunoizidorio.com.br`.
- **Transitions**:
  - Clicking "Carregar Relatório de Exemplo" or dropping a valid Semgrep CLI JSON file transitions `view` immediately to `'dashboard'`.
  - Clicking "Voltar à Página Inicial" or "Novo Scan" in the Header returns `view` to `'landing'` (or resets store state).

---

## 6. Testing & Quality Assurance Requirements

- **Unit Tests (Vitest & Testing Library):**
  - Verify `LandingPage.tsx` renders all 5 sections cleanly.
  - Test navigation transitions when clicking "Carregar Exemplo" or uploading a JSON file.
  - Verify zero-persistence callouts and domain branding (`semgrep.brunoizidorio.com.br`).
- **Build Verification:**
  - Clean TypeScript compilation with `tsc -b`.
  - Production bundle compilation with `vite build`.

---

## 7. Approval & Next Steps

This design specification is aligned with `docs/handoff_completo_semgrep_visualizer.md` and ready for implementation.
