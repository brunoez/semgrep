# Guia de Implantação em Produção (Docker & Nginx)

> **Domínio de Produção:** `semgrep.brunoizidorio.com.br`  
> **Arquitetura:** 100% Client-Side SPA (Zero Backend, Zero Data Persistence)  
> **Stack de Produção:** Docker Multi-stage + Nginx Unprivileged + Security Headers

---

## 📋 Visão Geral da Arquitetura de Produção

O **Semgrep CLI Visualizer** é uma aplicação web estática (SPA) que executa a validação, parsing, cálculo do Executive Risk Score e renderização dos gráficos **exclusivamente no navegador do cliente (RAM do navegador)**. 

Não há banco de dados, API backend ou armazenamento persistente. O container Docker atua exclusivamente servindo os artefatos estáticos otimizados (HTML, JS, CSS, SVG) via Nginx de alta performance com cabeçalhos de segurança OWASP.

---

## 🛠️ Pré-requisitos do Servidor (VPS / Cloud)

Antes de iniciar a implantação na sua VPS (Oracle Cloud, DigitalOcean, AWS EC2, GCP ou servidor próprio):

- **Git:** Instalado na VPS (`sudo apt install -y git`)
- **Docker Engine:** Versão 24.0+ (ou superior) instalada
- **Docker Compose:** Plugin v2.0+ instalado
- **Portas Liberadas:** Porta `80` (HTTP) e `443` (HTTPS) no firewall
- **Domínio Apontado:** Registro DNS tipo `A` apontando seu domínio para o IP público da VPS

---

## 🤖 Descoberta Automática por Agentes de IA (IsItAgentReady / Agent-Ready Standards)

A aplicação inclui suporte nativo aos padrões abertos de AI Agent Discovery (RFC 8288, RFC 9727, RFC 8414, RFC 9728, SEP-1649, WebMCP, Markdown Negotiation):

- **Sitemap & Robots.txt:** `https://semgrep.brunoizidorio.com.br/sitemap.xml` referenciado em `robots.txt`.
- **Markdown Negotiation:** Requisições HTTP com `Accept: text/markdown` retornam `https://semgrep.brunoizidorio.com.br/index.md`.
- **Link Headers (RFC 8288):** Retorna `Link: </.well-known/api-catalog>; rel="api-catalog", </.well-known/agent-skills/index.json>; rel="agent-skills", ...`.
- **API Catalog (RFC 9727):** `https://semgrep.brunoizidorio.com.br/.well-known/api-catalog` (`application/linkset+json`).
- **MCP Server Card (SEP-1649):** `https://semgrep.brunoizidorio.com.br/.well-known/mcp/server-card.json`.
- **Agent Skills Index:** `https://semgrep.brunoizidorio.com.br/.well-known/agent-skills/index.json`.
- **OAuth & Auth.md:** Metadata em `/.well-known/oauth-authorization-server`, `/.well-known/oauth-protected-resource` e `/auth.md`.
- **WebMCP API:** Suporte nativo a `navigator.modelContext.provideContext()` expondo as ferramentas `analyze_semgrep_report` e `get_executive_risk_score`.

---

## 🚀 Implantação na VPS (Passo a Passo)

### Passo 1: Criar e Configurar o Diretório de Destino
Na VPS, crie a pasta `/opt/semgrep` e atribua permissão ao seu usuário não-root:
```bash
sudo mkdir -p /opt/semgrep
sudo chown -R $USER:$USER /opt/semgrep
```

### Passo 2: Clonar o Repositório do GitHub
Execute o clone no diretório criado:
```bash
git clone https://github.com/brunoez/semgrep.git /opt/semgrep
cd /opt/semgrep
```

### Passo 3: Executar o Container via Docker Compose
Construa a imagem e inicie o container em segundo plano:
```bash
docker compose up -d --build
```

### Passo 4: Verificar a Execução Inicial
Certifique-se de que o container está ativo e respondendo localmente:
```bash
docker compose ps
curl -I http://localhost:8080
```
*O container estará servindo o Nginx interno na porta `8080`.*

---

## 🔒 Configuração de SSL/TLS (HTTPS)

Para expor a aplicação publicamente com certificado SSL/TLS gratuito do Let's Encrypt:

### Nginx Reverse Proxy no Host + Certbot

1. Instale Nginx e Certbot no host da VPS:
```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

2. Crie o arquivo de configuração `/etc/nginx/sites-available/semgrep.brunoizidorio.com.br`:
```nginx
server {
    server_name semgrep.brunoizidorio.com.br;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Ative o site e emita o certificado SSL:
```bash
sudo ln -s /etc/nginx/sites-available/semgrep.brunoizidorio.com.br /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d semgrep.brunoizidorio.com.br
```

---

## 🧪 Verificação de Saúde e Teste de Segurança

Após o deploy, valide a aplicação:

### 1. Teste de Cabeçalhos HTTP de Segurança
```bash
curl -I https://semgrep.brunoizidorio.com.br
```

### 2. Logs do Container em Produção
```bash
docker compose -f /opt/semgrep/docker-compose.yml logs -f
```
