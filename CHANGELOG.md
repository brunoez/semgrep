# Registro de Alterações (CHANGELOG)

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.3] - 2026-07-30

### 🛠️ Corrigido (Fixed)
- **Mapeamento de Volume no Semgrep SAST:**
  - Criado o link simbólico `ln -sf "$CI_PROJECT_DIR" /src` no job `semgrep_sast_scan`, satisfazendo a verificação interna de diretório da CLI do Semgrep em containers Docker no GitLab CI.

---

## [1.0.2] - 2026-07-30

### 🚀 Adicionado (Added)
- **Atualização da Documentação de Alterações:**
  - Registro sincronizado do histórico de versões e melhorias no ecossistema de CI/CD.

---

## [1.0.1] - 2026-07-30

### 🚀 Adicionado (Added)
- **Configuração de Permissão Gitleaks (.gitleaks.toml & .gitleaksignore):**
  - Adicionado suporte a `allowlist` para ignorar relatórios de amostra de vulnerabilidades estáticas de demonstração (`frontend/public/samples/semgrep-sample-report.json` e `docs/`).
- **Tag Global de Runner no GitLab CI/CD:**
  - Adicionada a tag de runner `oracle-vps` como padrão global no `.gitlab-ci.yml` para rotear todos os jobs para a VPS própria.
- **Melhoria Visual no Executive Security Rating:**
  - Medidor circular SVG proporcional exibindo apenas a Letra da Nota de Segurança (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`) centralizada no anel, com o score numérico `30 / 100` em destaque no título esquerdo.

### 🛠️ Corrigido (Fixed)
- **Sobrescrita de Entrypoint no GitLab CI:**
  - Sobrescrito o entrypoint com vetor vazio (`entrypoint: [""]`) nos jobs de segurança (`gitleaks`, `semgrep`, `trivy`), corrigindo o erro `unknown command "sh"`.
- **Exceção de Volume de Código no Semgrep CLI:**
  - Configurada a variável `SEMGREP_IN_DOCKER: "0"` no job `semgrep_sast_scan`, evitando a tentativa de montagem do volume `/src` inexistente no GitLab CI Runner.
- **Remoção de Redundância Visual:**
  - Eliminada a duplicidade do texto `(30/100)` que aparecia simultaneamente no título e no anel medidor.

---

## [1.0.0] - 2026-07-30

### 🚀 Adicionado (Added)
- **Landing Page SPA (Google Stitch 2-Column Design):**
  - Hero Section de 2 colunas com proposta de valor executiva e carregamento por arquivo/exemplo.
  - Animações fluidas com biblioteca GSAP v3 e regras de limpeza de estilos inline (`clearProps: 'all'`).
  - Seções de Funcionalidades, Como Funciona, FAQ Interativo e Rodapé.
- **Executive Security Rating (0-100 & Notas por Letras A+ até F):**
  - Motor de cálculo logarítmico ponderado (`100 - 40 * log10(1 + Impacto/10)`).
  - Anel medidor SVG proporcional com preenchimento dinâmico do arco de progresso.
  - Card explicativo em hover com fórmula matemática e detalhamento dos pontos por severidade.
- **Gráfico Radar OWASP Top 10 (Recharts):**
  - Visualização de distribuição de vulnerabilidades pelas categorias OWASP A01 a A10.
- **Motor de Priorização de Vulnerabilidades & Quick Wins:**
  - Algoritmo de cálculo de pontuação de prioridade (1-100).
  - Tiers de urgência (`P1 Urgente`, `P2 Alta`, `P3 Média`, `P4 Baixa`).
  - Identificação automática de **⚡ Quick Wins** (alto impacto com tempo estimado de remediação $\le 2\text{h}$).
- **Hotspots de Diretórios & Tech Stack Breakdown:**
  - Card de heatmap dos 5 diretórios com maior acúmulo de risco.
  - Classificação por tecnologias afetadas (Python, JavaScript, Secrets, Docker, Express).
- **Leitor de Código & Sanitização XSS:**
  - Modal para visualização de linhas de código vulneráveis com sanitização estrita via **DOMPurify**.
- **Infraestrutura de Produção e CI/CD:**
  - Multi-stage `Dockerfile` (Node 20 + Nginx Alpine).
  - `nginx.conf` com cabeçalhos de segurança OWASP (`CSP`, `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`).
  - `docker-compose.yml` para implantação com comando único.
  - Guia de implantação em produção em [docs/PROD.md](docs/PROD.md).
  - Esteira modular do GitLab CI/CD em `.gitlab-ci.yml` e `.gitlab/ci/`.
  - Relatório de exemplo completo baseado no scan do **OWASP JuiceShop**.

---

### 🛡️ Segurança (Security)
- Arquitetura 100% Client-Side sem banco de dados ou APIs backend.
- Validação estrita de schema JSON com biblioteca Zod.
- Auditoria de segurança de código aprovada.
