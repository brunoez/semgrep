# Plan: Semgrep CLI Visualizer Landing Page & Product Showcase

> **Target Domain:** `semgrep.brunoizidorio.com.br`  
> **Design Prototyping:** Google Stitch (https://stitch.withgoogle.com/)  
> **Goal:** Create a high-converting, security-focused C-Level Landing Page for the Semgrep CLI Visualizer SPA, seamlessly integrated into the React + Vite + Tailwind CSS codebase.

---

## 1. Overview & Architecture Strategy

Rather than immediately presenting a bare file upload box when opening `semgrep.brunoizidorio.com.br`, the application will feature a modern, dark-mode **Landing Page** designed for **CISOs, CTOs, VPs of Engineering, and Security Leaders**.

### Key Landing Page Sections (Google Stitch Alignment):
1. **Hero Section:** High-impact value proposition, animated glassmorphic background, live metric badges, and dual CTA buttons ("Experimentar com Scan de Exemplo" & "Analisar Meu JSON").
2. **Security & Zero-Persistence Guarantee Card:** Prominent security callouts highlighting 100% Client-Side execution, zero data persistence, zero telemetry, and OWASP Top 10 safe design.
3. **C-Level Feature Grid:** Highlighting Executive Risk Score, DefectDojo Parser Alignment, OWASP Top 10 radar mapping, and remediation effort estimation.
4. **Interactive How-It-Works Workflow:** 3-step visual guide showing `semgrep scan --json` -> Drop JSON -> Executive Dashboard.
5. **FAQ & Domain Footer:** Technical and compliance FAQ, domain branding (`semgrep.brunoizidorio.com.br`), GitHub link, and copyright.

---

## 2. Directory & Component Hierarchy

```
frontend/src/
├── components/
│   ├── landing/                  # Componentes da Landing Page
│   │   ├── LandingPage.tsx       # Componente Container Principal
│   │   ├── HeroSection.tsx       # Hero Banner & Call-to-Action
│   │   ├── SecurityFeatures.tsx  # Cards de Garantias de Segurança (Zero-Persistence)
│   │   ├── ValueProps.tsx        # Grid de Funcionalidades Executivas
│   │   ├── HowItWorks.tsx        # Guia Passo a Passo (Semgrep CLI -> Dashboard)
│   │   ├── FaqSection.tsx        # Perguntas Frequentes & Conformidade
│   │   └── LandingFooter.tsx     # Rodapé com Marca e Links
│   ├── common/
│   │   ├── Header.tsx            # Atualizado para suportar alternância Landing <-> Visualizador
│   │   └── FileDropzone.tsx
│   ├── dashboard/
│   └── explorer/
└── App.tsx                       # Gerenciador de navegação entre Landing e Dashboard
```

---

## 3. Implementation Tasks

### Task 1: Create Landing Page Container & Navigation State

**Files:**
- Create: `frontend/src/components/landing/LandingPage.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/tests/LandingPage.test.tsx`

**Details:**
- Implement state machine in `App.tsx` allowing switching between `view: 'landing'` and `view: 'visualizer'`.
- If a JSON file is uploaded or sample loaded, automatically transition to the Executive Dashboard.
- Write unit tests for landing view rendering and CTA click navigation.

---

### Task 2: Implement Hero Section with Google Stitch UI Aesthetics

**Files:**
- Create: `frontend/src/components/landing/HeroSection.tsx`

**Details:**
- Build rich hero banner with dark slate tones (`#020617`), indigo/emerald gradients, and glassmorphic card borders.
- Include headline: **"Transforme Scans de Segurança em Insights Executivos para C-Levels"**.
- Include subheadline explaining 100% browser-side parsing for Semgrep CLI JSON.
- Primary CTA: "Carregar Relatório JSON" (abre a área de intake).
- Secondary CTA: "Ver Exemplo ao Vivo" (carrega o relatório de exemplo instantaneamente).

---

### Task 3: Build Security & Zero-Persistence Guarantee Section

**Files:**
- Create: `frontend/src/components/landing/SecurityFeatures.tsx`

**Details:**
- Create prominent security badges:
  - 🛡️ **100% Client-Side SPA:** Zero backend, no database, findings stay in browser RAM.
  - 🔒 **OWASP Top 10 Safe:** Strict Zod schema validation and DOMPurify XSS sanitization.
  - ⚡ **DefectDojo Engine:** Standardized parser matching OWASP DefectDojo standards.
  - 📊 **Executive Risk Score:** Normalized 0-100 score for instant executive visibility.

---

### Task 4: Implement Value Proposition Grid & Workflow Guide

**Files:**
- Create: `frontend/src/components/landing/ValueProps.tsx`
- Create: `frontend/src/components/landing/HowItWorks.tsx`

**Details:**
- Build 3-column grid showcasing features: OWASP Breakdown, Remediation Hours, Code Viewer.
- Build 3-step workflow diagram:
  1. Terminal: `semgrep scan --json > report.json`
  2. Browser: Drag & drop `report.json` on `semgrep.brunoizidorio.com.br`
  3. Dashboard: Instant C-Level risk metrics & PDF report export.

---

### Task 5: Build FAQ & Footer Section with Domain Branding

**Files:**
- Create: `frontend/src/components/landing/FaqSection.tsx`
- Create: `frontend/src/components/landing/LandingFooter.tsx`

**Details:**
- FAQ questions addressing data privacy, file limits (50MB), and Semgrep CLI compatibility.
- Footer featuring `semgrep.brunoizidorio.com.br` domain name, open-source attribution, and developer contact.

---

### Task 6: Full Verification, Testing & Build Validation

**Files:**
- Modify: `frontend/tests/LandingPage.test.tsx`

**Verification Commands:**
```bash
cd frontend
npm run build
npx vitest run
```
- Ensure 100% test pass rate and clean production bundle compilation.

---

## 4. Next Steps for Developer / User

1. Prototipe os componentes visuais e layouts desejados no **Google Stitch** (https://stitch.withgoogle.com/).
2. Quando estiver pronto com as ideias do Stitch, podemos iniciar a execução deste plano tarefa por tarefa!
