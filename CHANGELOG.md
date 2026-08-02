# Registro de Alterações (CHANGELOG)

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.15] - 2026-08-02

### 📱 Progressive Web App (PWA Support)
- **Web App Manifest (`manifest.json`):** Publicado manifesto PWA com ícones responsivos, atalhos de ação ("Novo Scan"), suporte a modo `standalone` e tema visual alinhado ao slate-950 (`#0f172a`).
- **Service Worker (`sw.js` & `serviceWorkerRegistration.ts`):** Implementada estratégia de cache *Network First* com fallback offline para instâncias do navegador. Registro seguro via TypeScript em `main.tsx` mantendo conformidade estrita com a Content Security Policy (CSP).
- **Metadados Mobile & iOS:** Adicionadas meta tags de suporte PWA para dispositivos móveis (`mobile-web-app-capable`, `apple-mobile-web-app-capable`, `apple-touch-icon`).
- **Configuração Nginx (`nginx.conf`):** Criados endpoints dedicados para `/manifest.json` (`application/manifest+json`) e `/sw.js` com cabeçalho `Service-Worker-Allowed: /` e política de no-cache para atualizações instantâneas do worker.
- **Testes de Integração PWA:** Criada a suíte de testes unitários [`pwa.test.ts`](frontend/tests/pwa.test.ts) cobrindo manifest.json, sw.js e meta tags no index.html.

---

## [1.0.14] - 2026-08-02

### 🛠️ Corrigido (Fixed)
- **Correção de Push no GitLab Container Registry (`docker.gitlab-ci.yml`):**
  - Resolvido o erro `error from registry: blob unknown to registry` durante a etapa `docker-build` no GitLab CI/CD ativando `DOCKER_BUILDKIT: "1"`, fazendo pull explícito das imagens base (`node:20-alpine` e `nginx:alpine-slim`) e utilizando `--no-cache` no `docker build`.

---

## [1.0.13] - 2026-08-02

### 🤖 Descoberta Automática de IA (IsItAgentReady / Agent-Ready Standards)
- **Sitemap & Robots.txt:** Publicado `sitemap.xml` com a URL canônica do projeto e adicionada a referência `Sitemap:` no `robots.txt`.
- **Markdown Negotiation:** Suporte ao cabeçalho `Accept: text/markdown` via rewrite do Nginx servindo `index.md` para agentes de IA com cabeçalhos `Vary: Accept` e `x-markdown-tokens`.
- **Link Response Headers (RFC 8288):** Adicionados cabeçalhos HTTP `Link` mapeando `api-catalog`, `agent-skills`, `mcp-server-card` e `service-doc`.
- **API Catalog (RFC 9727):** Publicado `/.well-known/api-catalog` com o schema `application/linkset+json`.
- **OAuth & Auth.md (RFC 8414 & RFC 9728):** Disponibilizadas especificações e metadados de autenticação e registro anônimo de agentes em `/.well-known/oauth-authorization-server`, `/.well-known/oauth-protected-resource`, `/.well-known/openid-configuration` e `/auth.md`.
- **MCP Server Card (SEP-1649):** Publicado `/.well-known/mcp/server-card.json`.
- **Agent Skills Discovery Index:** Publicado `/.well-known/agent-skills/index.json` (schema v0.2.0).
- **Integração WebMCP API:** Implementada em `webMcp.ts` com chamada a `navigator.modelContext.provideContext()` registrando as ferramentas `analyze_semgrep_report` e `get_executive_risk_score` nativas do navegador.
- **Suíte de Testes de Agent Discovery:** Adicionados testes unitários em [`agentDiscovery.test.ts`](frontend/tests/agentDiscovery.test.ts) validando arquivos estáticos, schemas JSON e ferramentas WebMCP.

---

## [1.0.12] - 2026-08-02

### 🔒 Segurança & Hardening (Security & Hardening)
- **Endurecimento de Cabeçalhos HTTP de Segurança (Nginx Security Headers):**
  - **Permissions-Policy:** Adicionado o cabeçalho `Permissions-Policy` desabilitando APIs de hardware e navegador não utilizadas (`camera=()`, `microphone=()`, `geolocation=()`, `payment=()`, `usb=()`, etc.).
  - **Content-Security-Policy (CSP):** Removida a diretiva `'unsafe-inline'` de `script-src` na configuração do Nginx ([`nginx.conf`](frontend/nginx.conf)) para reforçar a mitigação contra ataques de Cross-Site Scripting (XSS).
  - **Isolamento de Origem (COEP / COOP / CORP):** Adicionados os cabeçalhos de segurança avançados `Cross-Origin-Embedder-Policy: credentialless`, `Cross-Origin-Opener-Policy: same-origin` e `Cross-Origin-Resource-Policy: same-origin`.
  - **Preservação de Cabeçalhos em Assets Estáticos:** Re-declarados os cabeçalhos de segurança dentro do bloco `location ~* \.(?:js|css...)` no Nginx para evitar que o Cache-Control sobrescreva os cabeçalhos de segurança pai em arquivos estáticos.
  - **Testes de Integração Nginx:** Adicionada suíte de testes unitários automatizados em [`nginx.config.test.ts`](frontend/tests/nginx.config.test.ts) validando a presença e formato de todos os cabeçalhos de segurança no build.

---

## [1.0.11] - 2026-07-30

### 🛠️ Corrigido & 🚀 Melhorado (Fixed & Improved)
- **Tradução Completa do Dashboard Executivo & Explorer (i18n):**
  - Conectados todos os componentes da página de resultados e dashboard executivo ao dicionário `translations.ts` via `useLanguage()`: [`RiskScoreBadge.tsx`](frontend/src/components/dashboard/RiskScoreBadge.tsx), [`ExecutiveMetrics.tsx`](frontend/src/components/dashboard/ExecutiveMetrics.tsx), [`SeverityChart.tsx`](frontend/src/components/dashboard/SeverityChart.tsx), [`OwaspRadarChart.tsx`](frontend/src/components/dashboard/OwaspRadarChart.tsx), [`TopHotspotsCard.tsx`](frontend/src/components/dashboard/TopHotspotsCard.tsx), [`TechStackBreakdown.tsx`](frontend/src/components/dashboard/TechStackBreakdown.tsx), [`VulnerabilityTable.tsx`](frontend/src/components/explorer/VulnerabilityTable.tsx) e [`CodeViewerModal.tsx`](frontend/src/components/explorer/CodeViewerModal.tsx).
  - Expandido o dicionário `src/locales/translations.ts` com suporte bilíngue completo (PT-BR e EN-US) para classificações de risco (A+ a F), métricas C-Level, distribuição de severidades, gráficos OWASP, hotspots, ecossistemas de código, filtros/ordenação do explorer e justificativas de prioridade.

---

## [1.0.10] - 2026-07-30

### 🛠️ Corrigido & 🚀 Melhorado (Fixed & Improved)
- **Tradução Completa da Landing Page (i18n):**
  - Conectados todos os componentes da Landing Page ao dicionário `translations.ts` via `useLanguage()`: [`HeroSection.tsx`](frontend/src/components/landing/HeroSection.tsx), [`FileDropzone.tsx`](frontend/src/components/common/FileDropzone.tsx), [`HowItWorks.tsx`](frontend/src/components/landing/HowItWorks.tsx), [`ValueProps.tsx`](frontend/src/components/landing/ValueProps.tsx), [`SecurityFeatures.tsx`](frontend/src/components/landing/SecurityFeatures.tsx), [`FaqSection.tsx`](frontend/src/components/landing/FaqSection.tsx) e [`LandingFooter.tsx`](frontend/src/components/landing/LandingFooter.tsx).
  - Expandido o dicionário em `src/locales/translations.ts` com traduções completas para todos os títulos, descrições, botões, selos, áreas de drop/paste e seções de FAQ em Português e Inglês.

---

## [1.0.9] - 2026-07-30

### 🚀 Adicionado (Added)
- **Suporte Multi-Idioma (i18n PT-BR / EN-US):**
  - Adicionado seletor de idiomas no cabeçalho ([`LanguageSwitcher.tsx`](frontend/src/components/common/LanguageSwitcher.tsx)) com ícones de bandeiras (🇧🇷 PT / 🇺🇸 EN).
  - Implementado o gerenciamento global de tradução via React Context ([`LanguageContext.tsx`](frontend/src/context/LanguageContext.tsx)) com dicionários estritamente tipados ([`translations.ts`](frontend/src/locales/translations.ts)).
  - Suporte a detecção automática do idioma preferido do navegador (`navigator.language`) com fallback para Português (Brasil).
  - Persistência e validação estrita contra *input injection* no `localStorage` (`semgrep_app_lang`).
  - Atualização dinâmica do atributo `document.documentElement.lang` para SEO e leitores de tela.
  - Suíte de testes unitários abrangente cobrindo troca de idioma, persistência e sanitização em `frontend/tests/LanguageContext.test.tsx` e `frontend/tests/LanguageSwitcher.test.tsx`.

---

## [1.0.8] - 2026-07-30

### 🚀 Adicionado (Added)
- **Tag de Versão Dinâmica no Rodapé (`LandingFooter.tsx`):**
  - Adicionado badge dinâmico da versão da aplicação (`v1.0.8`) no rodapé (footer), importado automaticamente do `package.json` a cada nova release sem necessidade de alteração manual no componente.
  - Exibição estendida do rodapé tanto na Landing Page quanto no Dashboard do projeto.

---

## [1.0.7] - 2026-07-30

### 🚀 Adicionado & 🛠️ Melhorado (Added & Improved)
- **Tabela Clicável no Explorer (`VulnerabilityTable.tsx`):**
  - Toda a linha `<tr>` da tabela de vulnerabilidades tornou-se interativa e clicável (`cursor-pointer`), além de aceitar navegação por teclado (`Enter` / `Espaço`) com destaque do botão de ação em hover (`group-hover`).
- **Animações GSAP no Modal (`CodeViewerModal.tsx`):**
  - Implementadas animações fluídas de entrada (`fromTo` com `scale: 0.92`, `y: 20` ➔ `scale: 1`, `y: 0`) e saída via GSAP ao fechar o modal.
- **Fechamento via Tecla ESC (`CodeViewerModal.tsx`):**
  - Adicionado listener global de teclado para fechar o modal suavemente ao pressionar a tecla `ESC`.

---

## [1.0.6] - 2026-07-30

### 🛠️ Corrigido (Fixed)
- **Resolução de Conflito de Porta (Port 8080 Allocated):**
  - Atualizado o script em [`.gitlab/ci/deploy.gitlab-ci.yml`](.gitlab/ci/deploy.gitlab-ci.yml) para identificar e encerrar dinamicamente qualquer container publicado na porta 8080 (`docker ps -a -q --filter "publish=8080"`) antes de subir a nova instância `semgrep-app`, eliminando a falha `Bind for 0.0.0.0:8080 failed`.

---

## [1.0.5] - 2026-07-30

### 🛠️ Corrigido (Fixed)
- **Título & Metadados SEO (`index.html`):**
  - Atualizado o elemento `<head>` da aplicação trocando a tag genérica `<title>frontend</title>` por `Semgrep CLI Visualizer & Executive Security Dashboard`, além de incluir metadados SEO, Open Graph e fontes do Google (*Inter* e *JetBrains Mono*).
- **Ajuste de CSP no Nginx (`nginx.conf`):**
  - Atualizada a regra de `Content-Security-Policy` adicionando origens autorizadas para os scripts e chamadas de métricas do Cloudflare Insights (`https://static.cloudflareinsights.com`) e Google Analytics nas diretivas `script-src` e `connect-src`.
- **Estratégia de Deploy no GitLab CI (`deploy.gitlab-ci.yml`):**
  - Migrado o deploy para um fluxo Cloud-Native via Container Registry (`docker pull`), resolvendo a incompatibilidade com o Docker Executor do GitLab Runner sem afetar outros projetos do servidor.
- **Gestão de Espaço em Disco no Docker:**
  - Configurada a limpeza pós-deploy com `docker image prune -af`, removendo automaticamente imagens e tags de commits anteriores não associadas a containers ativos.

---

## [1.0.4] - 2026-07-30

### 🚀 Adicionado (Added)
- **Autorização SSH & Deploy Keys na VPS:**
  - Adicionado guia passo a passo em [docs/PROD.md](docs/PROD.md) para autorização de `git clone` e `git pull` na VPS utilizando GitLab Deploy Keys (acesso restrito somente leitura).
- **Módulo de Deploy Automatizado no GitLab CI/CD:**
  - Criado o arquivo modular [`.gitlab/ci/deploy.gitlab-ci.yml`](.gitlab/ci/deploy.gitlab-ci.yml) e incluído no [`.gitlab-ci.yml`](.gitlab-ci.yml), com suporte a GitLab Environments (`production`), reconstrução de containers Docker e verificação de saúde local post-deploy.

### 🛠️ Corrigido (Fixed)
- **Padronização do Diretório de Produção:**
  - Unificados os caminhos do repositório e diretório na VPS de `/opt/semgrep-front` para `/opt/semgrep`.

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
