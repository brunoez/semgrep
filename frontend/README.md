# Semgrep CLI Frontend Visualizer & C-Level Dashboard

Dashboard executivo e visualizador de resultados do **Semgrep CLI**, 100% client-side, focado em segurança (OWASP Top 10 safe), alta performance e insights executivos para C-Levels (CISO, CTO, VP de Engenharia).

## Principais Funcionalidades
- **Zero-Persistence & Data Privacy:** 100% SPA no navegador. Nenhum relatório é enviado para servidores externos ou armazenado localmente.
- **Executive Risk Score (0-100):** Cálculo inteligente da pontuação de risco baseado em severidade e densidade de vulnerabilidades.
- **Gráficos Executivos:** Donut chart por severidade e gráfico de distribuição OWASP Top 10 mapeado.
- **Vulnerability Explorer:** Tabela interativa com busca em tempo real, filtro por severidade e leitor seguro de trechos de código.
- **DefectDojo Parser Alignment:** Leitura rigorosa e normalização do JSON gerado pelo Semgrep CLI.
- **Suporte Multi-Entrada:** Drag & drop de arquivos JSON (limite 50MB), colador direto de texto ou relatório de exemplo pré-carregado.

## Tecnologias Utilizadas
- **React 18 + Vite + TypeScript**
- **Tailwind CSS** (Dark Mode executivo)
- **Zod & DOMPurify** (Validação runtime de schema e prevenção contra XSS)
- **Recharts** (Visualização de dados interativa)
- **Vitest & React Testing Library** (Suíte completa de testes unitários)

## Como Rodar Localmente

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar as dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

## Como Rodar os Testes

```bash
npm run test
```

## Como Gerar o Build de Produção

```bash
npm run build
```
