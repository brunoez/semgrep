# Registro de Alterações (CHANGELOG)

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.2.0] - 2026-08-29

### 🔐 Segurança & Hardening Contínuo (SDD-003)
- **Supply Chain Security & Atualização do DOMPurify (P1):**
  - Atualizada a dependência de produção `dompurify` para `^3.2.4` em `frontend/package.json` e sincronizado o `package-lock.json`, eliminando advisory de segurança (GHSA-55q2-fjhq-7xh7) e assegurando 0 vulnerabilidades no `npm audit --omit=dev`.
- **Hardening de Diretivas CSP no Nginx (P2):**
  - Inclusão explícita das diretivas `object-src 'none';` e `base-uri 'self';` em todas as declarações `Content-Security-Policy` no `frontend/nginx.conf`, bloqueando injeções por plugins legados e manipulações da URL base do documento.
- **Validação Defensiva de MIME Type no FileDropzone (P3):**
  - Implementada verificação defensiva de `file.type` em `frontend/src/components/common/FileDropzone.tsx`, rejeitando antecipadamente arquivos binários e não-JSON antes do acionamento do `FileReader`.

### 📐 Especificações & Qualidade (TDD)
- **Invariantes de Arquitetura & BDD Feature:**
  - Validação estrita dos invariantes de Zero-Persistence e isolamento em memória RAM.
- **Cobertura de Testes Automatizados:**
  - Criado `frontend/tests/FileDropzone.test.tsx` e expandido `frontend/tests/nginx.config.test.ts`, elevando a suíte para 13 arquivos e 48 testes unitários/integração no Vitest passando com 100% de sucesso.

---

## [1.1.0] - 2026-08-29

### 🔐 Segurança & Hardening de Contêiner
- **Hardening de Contêiner Nginx Unprivileged:**
  - Migrada a imagem base de produção no `frontend/Dockerfile` para `nginxinc/nginx-unprivileged:alpine-slim`.
  - Reconfigurado o Nginx (`frontend/nginx.conf`) para escuta na porta não-privilegiada `8080` e execução sob usuário `101:101` (`USER 101`), em conformidade com o CIS Docker Benchmark e diretrizes OWASP.
  - Atualizado `docker-compose.yml` para mapeamento `8080:8080` e healthcheck na porta `8080`.
- **Defesa contra DoS e Validação de Limite no WebMCP:**
  - Implementada validação de teto de payload (50MB) e tratamento de erro defensivo estruturado no método `execute` da ferramenta WebMCP `analyze_semgrep_report` em `frontend/src/utils/webMcp.ts`.
- **Sanitização Consistente & Schemas Zod Estritos:**
  - Envolvido o campo OWASP com `sanitizeText()` em `frontend/src/components/explorer/VulnerabilityTable.tsx` para reforço de Defesa em Profundidade contra XSS.
  - Substituído `.passthrough()` por `.strip()` nos schemas Zod em `frontend/src/models/semgrep.schema.ts`, descartando propriedades desconhecidas e prevenindo acúmulo de memória.

### 📐 Engenharia Orientada a Especificações (`specs/`)
- **Framework de Especificações (SDD, BDD, SecDD, TDD):**
  - Criado o diretório `specs/` com documentação formal:
    - `specs/sdd/02-core-architecture-invariants.sdd.md`: Invariantes de arquitetura Zero-Persistence, RAM isolation e CSP.
    - `specs/bdd/client-privacy-sanitization.feature`: Cenários Gherkin para privacidade e mitigação de XSS.
    - `specs/secdd/threat-model-and-abuse-cases.md`: Modelagem de ameaças STRIDE e casos de abuso (*Abuse Cases*).
  - Expandida a suíte de testes Vitest para cobertura de todos os cenários TDD.

---

## [1.0.21] - 2026-08-02

### ⚙️ Docker Update
- **Atualização de Imagens Base:**
  - Atualizadas as configurações Docker para utilizar as versões mais recentes das imagens base.

---

## [1.0.20] - 2026-08-02

### ⚙️ Node & Docker Update
- **Atualização da Imagem Base Node.js para LTS (`node:lts-alpine`):**
  - Atualizada a imagem de build no `Dockerfile` para utilizar `node:lts-alpine`, acompanhando automaticamente as versões Long-Term Support mais recentes do Node.js.

---

## [1.0.19] - 2026-08-02

### 🔐 Segurança & CSP (`nginx.conf`)
- **Autorização de Hashes para Scripts Cloudflare RUM/Analytics:**
  - Adicionados os hashes SHA-256 dos scripts injetados pela Cloudflare (`'sha256-9rjqDwqng+84TaBV01no9yCOv0QZxnB5+Cy5n5J09ng='`, `'sha256-r14klObAIK8GtUiPavIov6OmoHnx0Q+H8GXjqrj+ZgQ='` e `'sha256-ZxnJQKzdWvpTYLVGIY3mXvorurcoffPR7ma3dOyFq5k='`) no diretiva `script-src` da Content-Security-Policy em `nginx.conf`, garantindo compatibilidade total sem comprometer a segurança ou introduzir `'unsafe-inline'`.

---

## [1.0.18] - 2026-08-02

### 🛠️ Corrigido (Fixed)
- **Blindagem do Service Worker (`sw.js`):**
  - Corrigida a excepção `TypeError: Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is unsupported` ignorando requisições que não utilizem protocolo `http`/`https` (como extensoes de navegador `chrome-extension://` e scripts injetados).
  - Corrigido o tratamento no fallback de rede em `sw.js` para assegurar que um objeto `Response` válido seja retornado sem lançar `Failed to convert value to 'Response'`.

---

## [1.0.17] - 2026-08-02

### 📚 Documentação & AI Agent Discovery (DNS-AID)
- **Guia Completo de Registros DNS-AID Cloudflare (`PROD.md`):**
  - Adicionado guia detalhado para cadastro de registros DNS para AI Discovery (DNS-AID conforme draft-mozleywilliams-dnsop-dnsaid e RFC 9460) na Cloudflare para o subdomínio `semgrep.brunoizidorio.com.br` cobrindo os entrypoints `_index._agents`, `_a2a._agents` e `_mcp._agents` com registros do tipo **HTTPS**, **SVCB** e **TXT**.

---

## [1.0.16] - 2026-08-02

### 🛠️ Corrigido (Fixed)
- **Otimização de Build OCI:**
  - Otimização do processo de build do container Docker para maior portabilidade e padronização.

---

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
- **Correção de Cache no Docker Build:**
  - Otimizado o carregamento de camadas base no `docker build`.

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
  - Ajustada a inicialização do container Docker para garantir encerramento limpo em portas alocadas.

---

## [1.0.5] - 2026-07-30

### 🛠️ Corrigido (Fixed)
- **Título & Metadados SEO (`index.html`):**
  - Atualizado o elemento `<head>` da aplicação trocando a tag genérica `<title>frontend</title>` por `Semgrep CLI Visualizer & Executive Security Dashboard`, além de incluir metadados SEO, Open Graph e fontes do Google (*Inter* e *JetBrains Mono*).
- **Ajuste de CSP no Nginx (`nginx.conf`):**
  - Atualizada a regra de `Content-Security-Policy` adicionando origens autorizadas para os scripts e chamadas de métricas do Cloudflare Insights (`https://static.cloudflareinsights.com`) e Google Analytics nas diretivas `script-src` e `connect-src`.

---

## [1.0.4] - 2026-07-30

### 🚀 Adicionado (Added)
- **Documentação de Produção:**
  - Adicionado guia passo a passo em [docs/PROD.md](docs/PROD.md) para implantação com Docker e Nginx.

---

## [1.0.3] - 2026-07-30

### 🛠️ Corrigido (Fixed)
- **Ajustes de Ambiente:**
  - Otimizações no build e na configuração do ambiente de desenvolvimento.

---

## [1.0.2] - 2026-07-30

### 🚀 Adicionado (Added)
- **Documentação de Versão:**
  - Atualização do histórico de versões.

---

## [1.0.1] - 2026-07-30

### 🚀 Adicionado (Added)
- **Melhoria Visual no Executive Security Rating:**
  - Medidor circular SVG proporcional exibindo apenas a Letra da Nota de Segurança (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`) centralizada no anel, com o score numérico `30 / 100` em destaque no título esquerdo.

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
- **Infraestrutura de Produção:**
  - Multi-stage `Dockerfile` (Node 20 + Nginx Alpine).
  - `nginx.conf` com cabeçalhos de segurança OWASP (`CSP`, `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`).
  - `docker-compose.yml` para implantação com comando único.
  - Guia de implantação em produção em [docs/PROD.md](docs/PROD.md).
  - Relatório de exemplo completo baseado no scan do **OWASP JuiceShop**.

---

### 🛡️ Segurança (Security)
- Arquitetura 100% Client-Side sem banco de dados ou APIs backend.
- Validação estrita de schema JSON com biblioteca Zod.
- Auditoria de segurança de código aprovada.
