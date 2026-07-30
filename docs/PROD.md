# Guia de Implantação em Produção (Docker, Nginx & GitLab CI/CD)

> **Domínio de Produção:** `semgrep.brunoizidorio.com.br`  
> **Arquitetura:** 100% Client-Side SPA (Zero Backend, Zero Data Persistence)  
> **Stack de Produção:** Docker Multi-stage + Nginx Alpine + Security Headers

---

## 📋 Visão Geral da Arquitetura de Produção

O **Semgrep CLI Visualizer** é uma aplicação web estática (SPA) que executa a validação, parsing, cálculo do Executive Risk Score e renderização dos gráficos **exclusivamente no navegador do cliente (RAM do navegador)**. 

Não há banco de dados, API backend ou armazenamento persistente. O container Docker atua exclusivamente servindo os artefatos estáticos otimizados (HTML, JS, CSS, SVG) via Nginx de alta performance com cabeçalhos de segurança OWASP.

---

## 🛠️ Pré-requisitos do Servidor (VPS / Cloud)

Antes de iniciar a implantação na sua VPS (Oracle Cloud, DigitalOcean, AWS EC2, GCP ou servidor próprio):

- **Git:** Instalado na VPS (`sudo apt install -y git`)
- **Docker Engine:** Versão 24.0+ instalada
- **Docker Compose:** Plugin v2.0+ instalado
- **Portas Liberadas:** Porta `80` (HTTP) e `443` (HTTPS) no firewall/Security List
- **Domínio Apontado:** Registro DNS tipo `A` apontando `semgrep.brunoizidorio.com.br` para o IP público da VPS

---

## 🔑 Autorização para `git clone` na VPS (GitLab Deploy Keys)

Para permitir que a VPS faça o `git clone` e receba atualizações do repositório no GitLab de forma segura (sem expor credenciais pessoais):

### Opção A: SSH Deploy Key (Recomendada)

#### 1. Gerar um par de chaves SSH exclusivo para a VPS
Acesse o terminal da sua VPS e gere a chave sem passphrase (para permitir automação):
```bash
ssh-keygen -t ed25519 -C "vps-semgrep-deploy" -f ~/.ssh/id_ed25519 -N ""
```

#### 2. Copiar a chave pública gerada
Exiba a chave pública gerada na VPS:
```bash
cat ~/.ssh/id_ed25519.pub
```
*Copie todo o conteúdo exibido (começando com `ssh-ed25519 ...`).*

#### 3. Cadastrar a Deploy Key no GitLab
1. No GitLab, acesse o repositório do projeto (`semgrep`).
2. Vá em **Settings > Repository**.
3. Expanda a seção **Deploy Keys**.
4. Clique em **Add key**.
5. Preencha os campos:
   - **Title:** `VPS Production Server`
   - **Key:** Cole a chave pública copiada no passo anterior.
   - **Grant write permissions to this key:** ❌ **Deixe DESMARCADO** (princípio do menor privilégio — acesso somente leitura para o repositório).
6. Clique em **Add key**.

#### 4. Testar a Autorização SSH na VPS
Na VPS, teste a conexão SSH com o GitLab:
```bash
ssh -T git@gitlab.com
```
*Ao ser questionado sobre o fingerprint (`Are you sure you want to continue connecting`), digite `yes`.*  
Saída esperada: `Welcome to GitLab, @seu-usuario!` ou mensagem indicando autenticação bem-sucedida.

---

### Opção B: GitLab Deploy Token (Alternativa HTTP/HTTPS)

1. No GitLab, acesse **Settings > Repository > Deploy Tokens**.
2. Crie um token com nome `vps-deploy-token` e marque a permissão `read_repository`.
3. Utilize a URL com token no clone:
```bash
git clone https://gitlab-ci-token:<DEPLOY_TOKEN>@gitlab.com/brunoizidorio/semgrep.git /opt/semgrep
```

---

## 🚀 Primeiro Deploy Manual na VPS (Passo a Passo)

Siga este procedimento para realizar a primeira implantação da aplicação no servidor:

### Passo 1: Criar e Configurar o Diretório de Destino
Na VPS, crie a pasta `/opt/semgrep` e atribua permissão ao seu usuário não-root:
```bash
sudo mkdir -p /opt/semgrep
sudo chown -R $USER:$USER /opt/semgrep
```

### Passo 2: Clonar o Repositório via SSH
Execute o clone no diretório criado:
```bash
git clone git@gitlab.com:brunoizidorio/semgrep.git /opt/semgrep
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

## 🔒 Configuração de SSL/TLS (HTTPS) para `semgrep.brunoizidorio.com.br`

Para expor a aplicação publicamente com certificado SSL/TLS gratuito do Let's Encrypt:

### Nginx Reverse Proxy no Host + Certbot (Recomendado)

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

## 🤖 Automatização do Deploy no GitLab CI/CD (`.gitlab-ci.yml`)

Após o **primeiro deploy manual**, a infraestrutura e o diretório `/opt/semgrep` já estão devidamente configurados na VPS. A partir deste ponto, o **GitLab CI/CD assume o deploy automatizado**.

### Como Funciona a Automação CI/CD

O projeto conta com o runner configurado com a tag `oracle-vps` diretamente na VPS de produção (ou executando tarefas no host). 

O estágio `deploy` está configurado no arquivo modular [`.gitlab/ci/deploy.gitlab-ci.yml`](file:///.gitlab/ci/deploy.gitlab-ci.yml) e incluído no [`.gitlab-ci.yml`](file:///.gitlab-ci.yml):

```yaml
deploy_production:
  stage: deploy
  image: docker:24-dind
  services:
    - docker:24-dind
  variables:
    DOCKER_DRIVER: overlay2
    DOCKER_TLS_CERTDIR: ""
  tags:
    - oracle-vps
  environment:
    name: production
    url: https://semgrep.brunoizidorio.com.br
  script:
    - echo "🚀 [1/4] Autenticando no GitLab Container Registry..."
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - echo "📥 [2/4] Baixando a imagem mais recente compilada ($CI_REGISTRY_IMAGE:latest)..."
    - docker pull $CI_REGISTRY_IMAGE:latest
    - echo "🐳 [3/4] Liberando a porta 8080 de quaisquer containers anteriores..."
    - docker rm -f semgrep-app || true
    - OLD_IDS=$(docker ps -a -q --filter "publish=8080")
    - if [ -n "$OLD_IDS" ]; then docker stop $OLD_IDS || true; docker rm -f $OLD_IDS || true; fi
    - echo "🚀 Iniciando novo container semgrep-app na porta 8080..."
    - docker run -d --name semgrep-app --restart always -p 8080:80 $CI_REGISTRY_IMAGE:latest
    - echo "🧹 [4/4] Limpando imagens antigas e não utilizadas..."
    - docker image prune -af
    - echo "✅ Deploy em produção concluído com sucesso!"
  only:
    - master
```

### Fluxo Continuativo do Pipeline

1. **Commit / Merge na branch `master`**: O pipeline do GitLab é disparado automaticamente.
2. **Estágios Anteriores**:
   - `security-scan` (Semgrep, Gitleaks)
   - `test` (Vitest)
   - `build` (Vite Build)
   - `docker-build` & `docker-security` (Trivy)
3. **Estágio `deploy`**:
   - Atualiza o código-fonte em `/opt/semgrep` com `git fetch` + `git reset --hard`.
   - Executa `docker compose up -d --build` para reconstruir a imagem Docker estática e recriar o container sem downtime.
   - Executa a limpeza de imagens antigas com `docker image prune -f`.

---

## 🧪 Verificação de Saúde e Teste de Segurança

Após qualquer deploy (manual ou via CI/CD), valide a aplicação:

### 1. Teste de Cabeçalhos HTTP de Segurança
```bash
curl -I https://semgrep.brunoizidorio.com.br
```

### 2. Logs do Container em Produção
```bash
docker compose -f /opt/semgrep/docker-compose.yml logs -f
```
