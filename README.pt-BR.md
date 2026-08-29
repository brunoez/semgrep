<div align="right">

[🇧🇷 Português](README.pt-BR.md) &nbsp;|&nbsp; [🇺🇸 English](README.md)

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
> **Repositório GitHub:** [https://github.com/brunoez/semgrep](https://github.com/brunoez/semgrep)

O **Semgrep CLI Visualizer** é uma plataforma web estática (SPA) moderna, desenhada para transformar resultados brutos de scans do Semgrep CLI em **dashboards de inteligência executiva (C-Level)** e **interfaces de priorização de remediação para times de engenharia**.

---

## 🔒 100% Client-Side & Zero-Persistence (Privacy First)

Toda a leitura de arquivos JSON, validação de schema Zod, normalização DefectDojo, cálculo de pontuação e renderização de gráficos ocorrem **exclusivamente no seu navegador (RAM local)**.

- ❌ **Sem Banco de Dados ou Backend**
- ❌ **Sem Envio de Código-Fonte para a Nuvem**
- ❌ **Sem Rastreamento de Telemetria ou Analytics**
- ✅ **Compatível com Ambientes Corporativos Sensíveis (PCI-DSS, LGPD, SOC2)**

---

## 🐳 Execução Rápida via Docker (GHCR)

Execute a aplicação instantaneamente em qualquer máquina sem precisar clonar o repositório ou instalar Node.js:

```bash
# Executar a imagem oficial do GitHub Packages
docker run -d -p 8080:8080 --name semgrep-visualizer ghcr.io/brunoez/semgrep:latest
```

Acesse em seu navegador: `http://localhost:8080`

---

## 🚀 Como Executar pelo Código-Fonte

### Pré-requisitos
- **Node.js:** Versão 20.x ou superior
- **npm:** Versão 10.x ou superior

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/brunoez/semgrep.git
cd semgrep/frontend

# 2. Instalar dependências
npm install

# 3. Executar servidor de desenvolvimento Vite
npm run dev
```

Acesse em seu navegador: `http://localhost:5173`

---

## 🛠️ Execução via Docker Compose

```bash
# Iniciar container via Docker Compose
docker compose up -d
```

---

## ✨ Principais Funcionalidades

### 1. 📊 Executive Security Rating (0-100 & Notas A+ até F)
- **Cálculo Logarítmico Ponderado:** Avalia vulnerabilidades Críticas (15 pts), Altas (5 pts), Médias (1.5 pts) e Baixas (0.5 pts) evitando saturação rápida em grandes projetos.
- **Medidor Circular SVG Dinâmico:** Exibe o preenchimento proporcional e a nota por letras (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`).

### 2. 🎯 Gráfico Radar OWASP Top 10 (Recharts)
- Mapeamento visual das 10 categorias OWASP (A01 Injection, A02 Broken Access Control, A03 Cryptographic Failures, etc.).

### 3. 🚀 Motor de Priorização & Quick Wins (ROI de Remediação)
- Classificação automática de vulnerabilidades em tiers de urgência:
  - **P1 Urgente:** Críticas/Altas com alto risco operacional.
  - **P2 Alta / P3 Média / P4 Baixa**
  - **⚡ Quick Wins:** Falhas com alto impacto de segurança e tempo estimado de correção $\le 2\text{h}$ (ex: Vazamento de credenciais em `.env`).

### 4. 🗂️ Hotspots de Diretórios & Tech Breakdown
- Identificação instantânea das pastas/módulos do projeto que concentram 80% do débito de segurança.
- Filtro por tecnologias afetadas (Python, JavaScript/TypeScript, Secrets, Docker, Express.js).

### 5. 💻 Leitor de Código Seguro com Proteção XSS (DOMPurify)
- Modal interativo para inspeção de trechos com proteção rigorosa contra Cross-Site Scripting.

### 6. 🌐 Suporte Multi-Idioma & Internacionalização (PT-BR / EN-US)
- Seletor visual de idiomas no topo da página (bandeiras 🇧🇷 PT / 🇺🇸 EN).
- Troca instantânea de contexto de tradução sem necessidade de recarga da página.
- Detecção automática do idioma do navegador (`navigator.language`) e sincronização dinâmica do atributo `lang` no elemento `<html>`.

---

## 📐 Engenharia Orientada a Especificações (Specs)

O projeto adota uma arquitetura formal de especificações e garantia de qualidade documentada no diretório [`specs/`](specs/):

- **SDD (*Spec-Driven Development*):** [Invariantes de Arquitetura Zero-Persistence & Isolamento](specs/sdd/02-core-architecture-invariants.sdd.md).
- **BDD (*Behavior-Driven Development*):** Cenários Gherkin executáveis em [`specs/bdd/`](specs/bdd/) cobrindo [privacidade e isolamento de memória](specs/bdd/client-privacy-sanitization.feature).
- **SecDD (*Security-Driven Development*):** [Modelagem de Ameaças STRIDE e Casos de Abuso](specs/secdd/threat-model-and-abuse-cases.md).
- **TDD (*Test-Driven Development*):** Suíte de testes automatizados no Vitest (48 testes) com 100% de cobertura dos critérios de segurança.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
