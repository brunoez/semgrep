<div align="right">

[🇺🇸 English](README.md) &nbsp;|&nbsp; [🇧🇷 Português](README.pt-BR.md)

</div>

# 🛡️ Semgrep CLI Visualizer & Executive Dashboard

[![GitHub Release](https://img.shields.io/github/v/release/brunoez/semgrep?style=flat-svg)](https://github.com/brunoez/semgrep/releases)
[![Docker Image](https://img.shields.io/badge/Docker_GHCR-ghcr.io%2Fbrunoez%2Fsemgrep-blue?style=flat-svg&logo=docker)](https://github.com/brunoez/semgrep/pkgs/container/semgrep)
[![Security Grade](https://img.shields.io/badge/Security_Rating-Grade_A%2B-100b981?style=flat-svg)](https://semgrep.brunoizidorio.com.br)
[![Framework](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-svg&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-svg&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-svg&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-svg)](LICENSE)

> **Live Demo:** [https://semgrep.brunoizidorio.com.br](https://semgrep.brunoizidorio.com.br)  
> **GitHub Repository:** [https://github.com/brunoez/semgrep](https://github.com/brunoez/semgrep)

**Semgrep CLI Visualizer** is a modern static web application (SPA) designed to transform raw Semgrep CLI scan outputs into **executive intelligence dashboards (C-Level)** and **actionable remediation prioritization interfaces for engineering teams**.

---

## 🔒 100% Client-Side & Zero-Persistence (Privacy First)

All JSON file parsing, Zod schema validation, DefectDojo normalization, security score computation, and chart rendering happen **exclusively in your browser (local RAM)**.

- ❌ **No Database or Backend Required**
- ❌ **No Source Code Sent to the Cloud**
- ❌ **No Telemetry Tracking or Analytics**
- ✅ **Fully Compliant with Strict Privacy & Compliance Standards (PCI-DSS, GDPR/LGPD, SOC2)**

---

## 🐳 Quick Start with Docker (GHCR)

Run the application instantly without cloning the repository or installing Node.js:

```bash
# Run the official image from GitHub Packages
docker run -d -p 8080:8080 --name semgrep-visualizer ghcr.io/brunoez/semgrep:latest
```

Access in your browser: `http://localhost:8080`

---

## 🚀 Running from Source Code

### Prerequisites
- **Node.js:** Version 20.x or higher
- **npm:** Version 10.x or higher

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/brunoez/semgrep.git
cd semgrep/frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```

Access in your browser: `http://localhost:5173`

---

## 🛠️ Running with Docker Compose

```bash
# Start container with Docker Compose
docker compose up -d
```

---

## ✨ Key Features

### 1. 📊 Executive Security Rating (0-100 & Grades A+ to F)
- **Weighted Logarithmic Calculation:** Evaluates Critical (15 pts), High (5 pts), Medium (1.5 pts), and Low (0.5 pts) vulnerabilities to prevent rapid score saturation on large codebases.
- **Dynamic Circular SVG Gauge:** Displays proportional fill and letter grades (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`).

### 2. 🎯 OWASP Top 10 Radar Chart (Recharts)
- Visual mapping across the 10 OWASP categories (A01 Injection, A02 Broken Access Control, A03 Cryptographic Failures, etc.).

### 3. 🚀 Prioritization Engine & Quick Wins (Remediation ROI)
- Automatic vulnerability triage into urgency tiers:
  - **P1 Urgent:** Critical/High with operational risk.
  - **P2 High / P3 Medium / P4 Low**
  - **⚡ Quick Wins:** High-security-impact findings with estimated fix time $\le 2\text{h}$ (e.g., Leaked credentials in `.env`).

### 4. 🗂️ Directory Hotspots & Tech Breakdown
- Instant identification of directories and modules concentrating 80% of security debt.
- Filter by affected technologies (Python, JavaScript/TypeScript, Secrets, Docker, Express.js).

### 5. 💻 Secure Code Viewer with XSS Protection (DOMPurify)
- Interactive snippet inspection modal with strict Cross-Site Scripting sanitization.

### 6. 🌐 Multi-Language & Internationalization Support (PT-BR / EN-US)
- Visual language switcher at the top of the interface (flags 🇧🇷 PT / 🇺🇸 EN).
- Instant translation context switching without page reloads.
- Automatic browser language detection (`navigator.language`) and dynamic synchronization of the HTML `lang` attribute.

---

## 📐 Specification-Driven Engineering (Specs)

The project adheres to a formal specification architecture and quality assurance framework documented in [`specs/`](specs/):

- **SDD (*Spec-Driven Development*):** [Zero-Persistence Architecture Invariants & Isolation](specs/sdd/02-core-architecture-invariants.sdd.md).
- **BDD (*Behavior-Driven Development*):** Executable Gherkin scenarios in [`specs/bdd/`](specs/bdd/) covering [memory isolation and client privacy](specs/bdd/client-privacy-sanitization.feature).
- **SecDD (*Security-Driven Development*):** [STRIDE Threat Model and Abuse Cases](specs/secdd/threat-model-and-abuse-cases.md).
- **TDD (*Test-Driven Development*):** Automated Vitest test suite with 100% coverage of security requirements.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
