# 🛡️ Semgrep CLI Visualizer & Executive Security Dashboard

> **100% Client-Side SAST Report Visualizer, Executive Risk Scoring Engine, and Interactive Code Explorer**

## Overview

The **Semgrep CLI Visualizer** is a privacy-first web application for converting raw Semgrep CLI JSON scan outputs into interactive executive security dashboards and code review interfaces.

All parsing, Executive Risk Score calculations (0–100 & Grades A+ to F), OWASP Top 10 radar mapping, tech stack breakdown, and vulnerability prioritization occur entirely inside the user's local browser memory (RAM). Zero code or scan data is transmitted to external servers.

## Key Capabilities & Architecture

- **Ingestion Engine**: Drag & Drop, File Upload, Paste raw JSON, or load bundled sample reports.
- **Executive Risk Score (0–100 & Grades A+ to F)**:
  - Transparent deduction formula based on findings severity, reachability, and OWASP mapping.
  - Grade scale: A+ (95–100), A (90–94), B (80–89), C (70–79), D (60–69), F (<60).
- **OWASP Top 10 Radar & Severity Breakdown**: Visual classification of SAST vulnerabilities by OWASP Category and Severity (ERROR, WARNING, INFO).
- **Vulnerability Explorer & Code Viewer**: Interactive table with sorting, filtering by tech stack/severity/OWASP, and code snippet viewer modal.
- **Quick Wins Remediation**: Prioritizes fixes with highest risk reduction ROI.

## Agent Discovery & Integration

- **Sitemap**: `https://semgrep.brunoizidorio.com.br/sitemap.xml`
- **API Catalog**: `https://semgrep.brunoizidorio.com.br/.well-known/api-catalog`
- **Agent Skills**: `https://semgrep.brunoizidorio.com.br/.well-known/agent-skills/index.json`
- **MCP Server Card**: `https://semgrep.brunoizidorio.com.br/.well-known/mcp/server-card.json`
- **WebMCP**: Native in-browser tool registration via `navigator.modelContext.provideContext()`.
