# language: pt
@security @api @resilience @owasp_api_top10 @remediation
Funcionalidade: Remediação de Segurança de APIs, Contratos RFC, Resiliência e Hardening
  Como Engenheiro Principal de Aplicação e Auditor de Segurança
  Eu quero que o sistema cumpra integralmente os contratos de API, mitigue vetores de DoS e aplique hardening defensivo
  Para assegurar conformidade com OWASP API Security Top 10, RFC 8414, RFC 9727, RFC 9728 e isolamento do cliente

  Contexto:
    Dado que a stack do Semgrep CLI Visualizer está configurada com Nginx e aplicação SPA React

  # =========================================================================
  # MÓDULO 1: CONTRATO DE API & AGENT DISCOVERY (ACHADO #1)
  # =========================================================================
  @api_contract @agent_discovery @rfc9727 @rfc8414
  Cenário: Entrega correta de metadados JSON nas rotas /.well-known/ sem retorno indevido de HTML
    Dado que um agente de IA ou scanner automatizado envia uma requisição "GET" para os endpoints de descoberta
    Quando a requisição atinge uma das seguintes rotas:
      | rota                                            | tipo_esperado             |
      | /.well-known/api-catalog                       | application/linkset+json  |
      | /.well-known/oauth-authorization-server        | application/json          |
      | /.well-known/oauth-protected-resource          | application/json          |
      | /.well-known/mcp/server-card.json              | application/json          |
      | /.well-known/agent-skills/index.json           | application/json          |
    Então a resposta deve retornar código HTTP "200 OK"
    E o cabeçalho "Content-Type" deve corresponder ao "tipo_esperado"
    E o corpo da resposta deve ser um documento JSON/Linkset válido sem tags HTML do "index.html"

  @api_contract @error_handling
  Cenário: Emissão de 404 estrito em rotas /.well-known/ não mapeadas sem fallback para o SPA
    Dado que um cliente requisita um endpoint inexistente "/.well-known/rota-inexistente"
    Quando o Nginx processa a requisição
    Então o servidor deve retornar status HTTP "404 Not Found"
    E não deve executar fallback para "/index.html" com "Content-Type: application/json"

  # =========================================================================
  # MÓDULO 2: RESILIÊNCIA & MITIGAÇÃO DE DoS NO CLIENTE (ACHADO #2)
  # =========================================================================
  @client_dos @dropzone @memory_protection
  Cenário: Rejeição imediata de arquivos JSON maiores que 50MB antes de alocação em memória RAM
    Dado que o usuário tenta carregar um arquivo "relatorio_massivo.json" com tamanho de 150MB no "FileDropzone"
    Quando o evento de seleção ou drop do arquivo é acionado
    Então a função "readFile" deve verificar o tamanho do arquivo antes de invocar "FileReader.readAsText"
    E a leitura assíncrona em memória deve ser abortada imediatamente
    E o usuário deve receber o alerta visual "O arquivo selecionado excede o limite máximo de 50MB."
    E a thread principal do navegador não deve sofrer congelamento ou Crash por OOM

  # =========================================================================
  # MÓDULO 3: RATE LIMITING & BUFFER OVERFLOW DEFENSE NO NGINX (ACHADO #3)
  # =========================================================================
  @rate_limiting @nginx @ddos_protection
  Cenário: Bloqueio de inundações de requisições e limitação do corpo no Nginx
    Dado que o servidor Nginx está ativo em produção
    Quando um cliente dispara mais de 30 requisições por segundo contra rotas estáticas ou de descoberta
    Então o módulo "limit_req" deve interceptar o tráfego excedente retornando HTTP "429 Too Many Requests" ou "503"
    E qualquer requisição com corpo superior a "50MB" deve ser rejeitada imediatamente com HTTP "413 Payload Too Large"

  # =========================================================================
  # MÓDULO 4: TIMEOUTS & RESILIÊNCIA EM CHAMADAS DOWNSTREAM (ACHADO #4)
  # =========================================================================
  @resilience @timeouts @downstream_calls
  Cenário: Cancelamento gracioso de requisição fetch ao exceder o tempo limite de 8 segundos
    Dado que a conexão de rede apresenta latência excessiva ou interrupção no carregamento de amostras
    Quando o método "loadSample()" dispara "fetch('/samples/semgrep-sample-report.json')"
    E o tempo de resposta ultrapassa "8000" milissegundos
    Então o sinal "AbortSignal.timeout(8000)" deve abortar a conexão
    E o estado "isLoading" da store Zustand deve ser restaurado para "false"
    E a mensagem de erro "Tempo limite esgotado ao carregar o exemplo de relatório." deve ser registrada

  # =========================================================================
  # MÓDULO 5: WEBMCP & INTEGRIDADE DE ESTADO (ACHADO #5)
  # =========================================================================
  @webmcp @state_isolation @consent_protocol
  Cenário: Execução da ferramenta WebMCP sem substituição não autorizada da análise ativa
    Dado que o usuário possui um relatório Semgrep carregado e visível no dashboard
    Quando um agente de IA executa a ferramenta "analyze_semgrep_report" via "navigator.modelContext"
    Então a ferramenta deve processar o JSON e retornar o "RiskScoreResult" diretamente para o agente
    E a tela do usuário não deve ser substituída silenciosamente sem confirmação ou autorização visual

  # =========================================================================
  # MÓDULO 6: HEADERS DE SEGURANÇA & HARDENING NGINX (ACHADO #6)
  # =========================================================================
  @security_headers @hsts @server_tokens
  Cenário: Validação de cabeçalho HSTS e ocultação de versão do servidor web
    Dado que uma resposta HTTP é emitida pelo Nginx
    Quando inspecionados os cabeçalhos de resposta
    Então o cabeçalho "Strict-Transport-Security" deve estar presente com "max-age=31536000; includeSubDomains; preload"
    E o cabeçalho "Server" não deve exibir o número de versão do Nginx
    E o arquivo de configuração deve conter a diretiva "server_tokens off;"

  # =========================================================================
  # MÓDULO 7: NORMALIZAÇÃO DE CONTRATO EM CAMINHOS WINDOWS (ACHADO #7)
  # =========================================================================
  @contract_normalization @cross_platform
  Esquema do Cenário: Normalização correta de caminhos de diretório com barras POSIX ou contrabarras Windows
    Dado que o relatório Semgrep contém uma vulnerabilidade no caminho "<caminho_arquivo>"
    Quando o método "getParentDirectory" processa o caminho
    Então o diretório pai identificado deve ser exatamente "<diretorio_esperado>"

    Exemplos:
      | caminho_arquivo                      | diretorio_esperado  |
      | src/controllers/auth.controller.ts   | src/controllers     |
      | src\\controllers\\auth.controller.ts | src/controllers     |
      | backend\\models\\user.model.ts       | backend/models      |
      | docker-compose.yml                   | Raiz do Projeto     |

  # =========================================================================
  # MÓDULO 8: CONFORMIDADE DE CÓDIGOS DE STATUS HTTP NO SERVICE WORKER (ACHADO #8)
  # =========================================================================
  @pwa @service_worker @http_standards
  Cenário: Retorno de código de status HTTP padronizado ao falhar requisição offline
    Dado que o Service Worker está ativo e a aplicação está sem conectividade com a internet
    Quando o navegador tenta buscar um recurso estático não armazenado em cache
    Então o Service Worker deve responder com status HTTP "503" e statusText "Service Unavailable"
    E não deve emitir códigos não padronizados como "488"

  # =========================================================================
  # MÓDULO 9: HARDENING DE CONTAINER DOCKER (ACHADO #9)
  # =========================================================================
  @container_hardening @docker @cgroups
  Cenário: Execução do contêiner de produção com sistema de arquivos somente-leitura e limites de recursos
    Dado que o serviço "semgrep-visualizer" é iniciado via Docker Compose em produção
    Quando inspecionada a configuração do contêiner
    Então a opção "read_only" deve estar definida como "true"
    E as capacidades Linux devem ser descartadas com "cap_drop: [ALL]"
    E o limite de memória deve ser restrito a no máximo "256M" e CPU a "0.50"

  # =========================================================================
  # MÓDULO 10: INTEGRIDADE DE SNIPPETS DE CÓDIGO (ACHADO #10)
  # =========================================================================
  @data_integrity @code_viewer @safe_escaping
  Cenário: Preservação de tags e genéricos em blocos de código com renderização segura
    Dado que uma vulnerabilidade detectada contém o trecho de código "<template><div>Hello <T></div></template>"
    Quando o usuário abre o modal "CodeViewerModal"
    Então o trecho de código exibido dentro da tag "<code>" deve conter todas as tags e caracteres "<" e ">" intactos
    E o React JSX deve escapar o texto nativamente impedindo qualquer execução de código JavaScript
