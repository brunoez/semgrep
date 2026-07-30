# Guia de Contribuição (CONTRIBUTING)

Agradecemos o seu interesse em contribuir para o **Semgrep CLI Visualizer & Executive Dashboard**! Este documento orienta sobre o fluxo de trabalho, padrões de código e diretrizes de segurança.

---

## 🔐 Diretrizes Fundamentais de Segurança (Security-First)

Antes de enviar qualquer contribuição, observe os pilares inegociáveis do projeto:

1. **Zero-Persistence / Client-Side Only:** Nenhuma funcionalidade pode enviar dados de relatórios, códigos ou métricas para servidores externos ou serviços de telemetria.
2. **Validação Estrita de Entrada:** Todo input JSON deve ser validado via schemas **Zod** antes do processamento.
3. **Sanitização de HTML / XSS:** Qualquer dado renderizado na interface deve obrigatoriamente passar por sanitização via **DOMPurify** (`sanitizeText`).
4. **Sem Secrets Hardcoded:** Nunca commite chaves de API, senhas ou tokens no repositório.

---

## 🌿 Fluxo de Branching & Git

Utilizamos o padrão de **GitFlow / Feature Branching**:

- `master`: Branch principal e estável de produção.
- `feat/nome-da-feature`: Para desenvolvimento de novas funcionalidades.
- `fix/descricao-da-correcao`: Para correção de bugs.
- `docs/nome-da-doc`: Para atualizações de documentação.

---

## 📝 Padronização de Commits (Conventional Commits)

Os commits devem seguir a especificação [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/):

- `feat: adiciona gráfico de distribuição de regras`
- `fix: resolve travamento de opacidade no GSAP`
- `docs: adiciona guia de deploy no PROD.md`
- `test: adiciona testes unitários para a priorização P1`
- `refactor: otimiza leitura do adaptador DefectDojo`

---

## 🧪 Testes Unitários & Qualidade

Todo código novo ou alterado deve possuir testes cobrindo cenários felizes e cenários de borda.

```bash
# Executar testes unitários com Vitest
cd frontend
npm test

# Executar verificação de tipos e build
npm run build
```

---

## 🚀 Processo de Pull Request / Merge Request

1. Faça um Fork do repositório no GitLab.
2. Crie sua branch (`git checkout -b feat/minha-funcionalidade`).
3. Implemente as alterações e garanta que `npm test` e `npm run build` passem sem erros.
4. Envie o commit e abra um **Merge Request** para a branch `master`.
5. Descreva claramente no Merge Request o que foi alterado e como testar.
