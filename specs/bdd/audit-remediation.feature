# language: pt
@security @audit_remediation @sdd_003
Funcionalidade: Remediação Pós-Auditoria de Segurança (SDD-003)
  Como engenheiro de segurança e arquiteto de software
  Eu quero que os 3 achados apontados no relatório de auditoria de segurança sejam mitigados
  Para assegurar integridade da cadeia de suprimentos (SCA), reforço de CSP e validação defensiva de inputs

  Contexto:
    Dado que a aplicação Semgrep CLI Visualizer está configurada no ambiente de desenvolvimento

  # =========================================================================
  # P1: Supply Chain Security & Resolução de Vulnerabilidades no NPM Audit
  # =========================================================================
  @p1 @supply_chain @npm_audit
  Cenário: Ausência de vulnerabilidades críticas ou moderadas nas dependências diretas
    Dado que as dependências do projeto foram instaladas via "npm ci" ou "npm install"
    Quando a ferramenta de análise de composição "npm audit" for executada no diretório "frontend/"
    Então o relatório de auditoria não deve apontar vulnerabilidades conhecidas no pacote "dompurify"
    E a compilação do TypeScript e Vite deve concluir com código de saída 0

  # =========================================================================
  # P2: Reforço de Diretivas CSP no Nginx (object-src e base-uri)
  # =========================================================================
  @p2 @csp @nginx @hardening
  Cenário: Presença das diretivas object-src 'none' e base-uri 'self' nos headers HTTP
    Dado que o arquivo de configuração "frontend/nginx.conf" está ativo no contêiner
    Quando o cliente ou navegador realiza uma requisição HTTP "GET" para "/"
    Então o cabeçalho de resposta "Content-Security-Policy" deve conter a diretiva "object-src 'none'"
    E o cabeçalho "Content-Security-Policy" deve conter a diretiva "base-uri 'self'"
    E nenhum plugin legado ou manipulação de base URL deve ser permitido pelo navegador

  # =========================================================================
  # P3: Validação Defensiva de MIME Type no FileDropzone
  # =========================================================================
  @p3 @dropzone @mime_validation @defense_in_depth
  Esquema do Cenário: Rejeição imediata de arquivos com MIME Type incompatível no dropzone
    Dado que o usuário tenta carregar um arquivo com o nome "<file_name>" e MIME Type "<mime_type>"
    Quando o evento de seleção ou drop for disparado no "FileDropzone"
    Então o componente deve interromper o processamento antes de acionar o "FileReader"
    E deve exibir o alerta com a mensagem de erro de formato inválido

    Exemplos:
      | file_name           | mime_type                 |
      | payload.exe.json    | application/x-msdownload  |
      | imagem_falsa.json   | image/png                 |
      | binario_dados.json  | application/octet-stream  |

  @p3 @dropzone @valid_json
  Cenário: Aceite de arquivos JSON válidos no FileDropzone
    Dado que o usuário seleciona um arquivo "resultado_semgrep.json" com MIME "application/json"
    Quando o arquivo for processado pelo "FileDropzone"
    Então a leitura via "FileReader.readAsText()" deve ser executada com sucesso
    E o relatório deve ser encaminhado para a store Zustand
