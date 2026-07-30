# Guia de Implantação em Produção (Docker & Nginx)

> **Domínio de Produção:** `semgrep.brunoizidorio.com.br`  
> **Arquitetura:** 100% Client-Side SPA (Zero Backend, Zero Data Persistence)  
> **Stack de Produção:** Docker Multi-stage + Nginx Alpine + Security Headers

---

## 📋 Visão Geral da Arquitetura de Produção

O **Semgrep CLI Visualizer** é uma aplicação web estática (SPA) que executa a validação, parsing, cálculo do Executive Risk Score e renderização dos gráficos **exclusivamente no navegador do cliente (RAM do navegador)**. 

Não há banco de dados, API backend ou armazenamento persistente. O container Docker atua exclusivamente servindo os artefatos estáticos otimizados (HTML, JS, CSS, SVG) via Nginx de alta performance com cabeçalhos de segurança OWASP.

---

## 🛠️ Pré-requisitos do Servidor (VPS / Cloud)

Antes de iniciar a implantação na sua VPS (DigitalOcean, AWS EC2, GCP, Linode ou servidor próprio):

- **Docker Engine:** Versão 24.0+ instalada
- **Docker Compose:** Plugin v2.0+ instalado
- **Portas Liberadas:** Porta `80` (HTTP) e `443` (HTTPS)
- **Domínio Apontado:** Registro DNS tipo `A` apontando `semgrep.brunoizidorio.com.br` para o IP público da VPS

---

## 📂 Arquivos de Configuração de Produção

O repositório já conta com todos os arquivos preparados para produção:

### 1. [frontend/Dockerfile](file:///home/bruno/Projetos/Semgrep%20front/frontend/Dockerfile) (Multi-stage Build)
- **Stage 1 (Builder):** Compila o código TypeScript/React com Vite em um ambiente isolado Node 20.
- **Stage 2 (Runner):** Copia os artefatos estáticos compilados para uma imagem Nginx Alpine ultra-leve (~25MB) sem manter dependências de desenvolvimento.

### 2. [frontend/nginx.conf](file:///home/bruno/Projetos/Semgrep%20front/frontend/nginx.conf) (Cabeçalhos & Roteamento SPA)
Configurações incluídas:
- **Gzip Compression:** Compressão de texto/JS/CSS reduzindo a carga de rede.
- **SPA Fallback:** `try_files $uri $uri/ /index.html;` (evita erro 404 ao atualizar rotas).
- **Cabeçalhos OWASP:** `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`, `Content-Security-Policy`, `Referrer-Policy`.
- **Cache Estático:** `Cache-Control` estático de 1 ano para arquivos hash (`js/css`).

### 3. [docker-compose.yml](file:///home/bruno/Projetos/Semgrep%20front/docker-compose.yml)
Gerencia a inicialização, reinicialização automática (`restart: always`), mapeamento de porta e verificação de saúde (`healthcheck`).

---

## 🚀 Passo a Passo de Deploy em Produção

### Passo 1: Clonar o Repositório na VPS
```bash
git clone https://github.com/seu-usuario/Semgrep-front.git /opt/semgrep-front
cd /opt/semgrep-front
```

### Passo 2: Executar o Container via Docker Compose
Rode o comando abaixo para construir a imagem e iniciar o serviço em segundo plano:

```bash
docker compose up -d --build
```

Para verificar o status do container:
```bash
docker compose ps
```

O container estará rodando localmente na porta `8080`.

---

## 🔒 Configuração de SSL/TLS (HTTPS) para `semgrep.brunoizidorio.com.br`

Para expor a aplicação na porta `443` com certificado SSL/TLS gratuito do Let's Encrypt, escolha uma das opções abaixo:

### Opção A: Nginx Proxy no Host + Certbot (Recomendado)

1. Instale o Nginx e Certbot no host:
```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

2. Crie o arquivo `/etc/nginx/sites-available/semgrep.brunoizidorio.com.br`:
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

3. Ative o site e emita o certificado HTTPS:
```bash
sudo ln -s /etc/nginx/sites-available/semgrep.brunoizidorio.com.br /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d semgrep.brunoizidorio.com.br
```

---

### Opção B: Cloudflare Tunnel (Zero Porta Exposta)

Se utilizar o Cloudflare:
1. Instale o `cloudflared` na VPS.
2. Crie o tunnel apontando o hostname `semgrep.brunoizidorio.com.br` para `http://localhost:8080`.
3. A porta `80/443` do servidor nem precisa ficar aberta para a internet pública!

---

## 🧪 Verificação de Saúde e Teste de Segurança

Após a implantação, execute os comandos de teste para validar a resposta do servidor:

### 1. Teste de Cabeçalhos HTTP de Segurança
```bash
curl -I https://semgrep.brunoizidorio.com.br
```
*Saída esperada:*
```http
HTTP/2 200
server: nginx
x-frame-options: DENY
x-content-type-options: nosniff
content-security-policy: default-src 'self'...
```

### 2. Verificar Logs do Container
```bash
docker compose logs -f
```

---

## 🔄 Atualização de Versão (Deploy Continuativo)

Para atualizar a aplicação quando houver novos commits:

```bash
cd /opt/semgrep-front
git pull origin master
docker compose up -d --build
```
O Docker compilará a nova versão sem causar downtime perceptível aos usuários.
