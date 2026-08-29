# language: pt
@security @remediation
Funcionalidade: Remediação de Falhas de Segurança & Hardening DevSecOps
  Como engenheiro de segurança e desenvolvedor
  Eu quero que as 5 vulnerabilidades identificadas (P1 a P5) sejam mitigadas
  Para assegurar conformidade do pipeline CI/CD, hardening do contêiner e blindagem do cliente

  Contexto:
    Dado que o projeto Semgrep CLI Visualizer está em execução no ambiente de desenvolvimento

  # =========================================================================
  # P1: Bloqueio do Pipeline CI/CD em Vazamento de Credenciais
  # =========================================================================
  @p1 @ci-cd @gitleaks
  Cenário: Interrupção imediata do pipeline ao detectar credenciais expostas
    Dado que um desenvolvedor submeteu um commit contendo uma chave de API real não listada no ".gitleaks.toml"
    Quando o job "gitleaks_secret_scan" for executado no GitLab CI
    Então o scanner deve identificar a credencial exposta com código de saída diferente de zero
    E o job deve falhar sem a flag "allow_failure: true"
    E os estágios subsequentes de "build" e "deploy" devem ser bloqueados automaticamente

  @p1 @ci-cd @allowlist
  Cenário: Aprovação do pipeline para relatórios de exemplo autorizados
    Dado que o repositório contém o arquivo de demonstração "semgrep-sample-report.json"
    E esse arquivo está devidamente cadastrado no allowlist do ".gitleaks.toml"
    Quando o job "gitleaks_secret_scan" for executado
    Então o scanner deve ignorar os dados de demonstração
    E o job deve concluir com status de sucesso

  # =========================================================================
  # P2: Hardening de Contêiner Nginx Unprivileged
  # =========================================================================
  @p2 @docker @hardening
  Cenário: Execução do contêiner Nginx de produção sob usuário não-root
    Dado que a imagem Docker foi compilada com base em "nginxinc/nginx-unprivileged:alpine-slim"
    Quando o contêiner de produção for iniciado
    Então o processo mestre do Nginx deve rodar com o UID não-root "101"
    E o Nginx deve escutar na porta não-privilegiada "8080"
    E a requisição de healthcheck para "http://localhost:8080/" deve retornar código HTTP 200

  # =========================================================================
  # P3: Defesa contra DoS e Limite de Tamanho no WebMCP
  # =========================================================================
  @p3 @webmcp @dos
  Cenário: Rejeição de payload massivo submetido via ferramenta WebMCP
    Dado que um agente de IA invoca o tool WebMCP "analyze_semgrep_report"
    Quando o argumento "reportContent" possuir um tamanho superior a 50MB (52.428.800 bytes)
    Então o tool deve rejeitar o processamento sem travar a thread principal da aba
    E deve retornar uma resposta estruturada com "success: false"
    E deve conter a mensagem de erro "O payload do relatório excede o limite de segurança de 50MB."

  @p3 @webmcp @success
  Cenário: Processamento bem-sucedido de payload válido via WebMCP
    Dado que um agente de IA invoca o tool "analyze_semgrep_report" com um JSON válido do Semgrep de 2MB
    Quando o método execute for concluído
    Então deve retornar "success: true"
    E deve retornar as métricas de Executive Risk Score, Risk Grade e total de vulnerabilidades calculadas

  # =========================================================================
  # P4: Isolamento Determinístico de Contêineres no Deploy
  # =========================================================================
  @p4 @deploy @devops
  Cenário: Parada e remoção isolada do contêiner da aplicação sem afetar vizinhos
    Dado que o script de deploy ".gitlab/ci/deploy.gitlab-ci.yml" é executado no runner VPS
    Quando a rotina de limpeza de contêineres anteriores for disparada
    Então o script deve encerrar estritamente o contêiner nomeado "semgrep-app"
    E não deve executar filtros genéricos por porta no host que possam derrubar outros serviços

  # =========================================================================
  # P5: Consistência de Sanitização e Schemas Zod Estritos (.strip)
  # =========================================================================
  @p5 @sanitization @zod
  Esquema do Cenário: Sanitização uniforme de campos na tabela de vulnerabilidades
    Dado que um relatório Semgrep contém uma vulnerabilidade com o campo OWASP "<owasp_raw>"
    Quando a tabela "VulnerabilityTable" renderizar a linha correspondente
    Então o valor exibido deve passar pela função "sanitizeText"
    E qualquer tag HTML maliciosa injetada deve ser completamente removida

    Exemplos:
      | owasp_raw                                            |
      | A01:2021-Broken Access Control                       |
      | <script>alert(1)</script>A03:Injection               |
      | <img src=x onerror=alert(document.domain)>A07:Auth   |

  @p5 @zod @strip
  Cenário: Descarte automático de propriedades poluídas via schema Zod com .strip()
    Dado que o payload JSON do Semgrep contém propriedades arbitrárias e não mapeadas no metadata
    Quando o schema "SemgrepReportSchema" realizar o parsing
    Então as propriedades desconhecidas devem ser descartadas (stripped)
    E o objeto normalizado deve conter apenas as chaves estritamente tipadas no domínio
