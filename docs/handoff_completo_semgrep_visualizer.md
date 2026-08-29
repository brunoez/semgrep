# Pacote de Handoff: Semgrep CLI Visualizer

Este documento contém todos os materiais necessários para a implementação e transição do projeto, incluindo especificações de design, ativos e prompts para uso no Antigravity.

---

## 1. Visão Geral do Projeto
O **Semgrep CLI Visualizer** é uma ferramenta focada em segurança (Zero-Persistence) que transforma arquivos JSON brutos do Semgrep em dashboards executivos diretamente no navegador.

**URL de Referência:** `semgrep.brunoizidorio.com.br`

---

## 2. Sistema de Design (Design Tokens)

### Cores (Tailwind CSS)
- **Background Principal:** `#020617` (`bg-slate-950`)
- **Superfícies de Cards:** `#0F172A` (`bg-slate-900`)
- **Bordas:** `#1E293B` (`border-slate-800`)
- **Cor Primária (Accent):** `#6366F1` (`indigo-500`)
- **Severidade Crítica:** `#F43F5E` (`rose-500`)
- **Severidade Alta/Média:** `#F59E0B` (`amber-500`)
- **Segurança/Sucesso:** `#10B981` (`emerald-500`)

### Tipografia
- **Interface:** Inter (Sans-serif)
- **Código/CLI:** Monospace (Consolas/JetBrains Mono)

---

## 3. Ativos e Prints
- **Screenshot do Dashboard Real:** `{{DATA:IMAGE:IMAGE_2}}`
- **Landing Page Projetada:** `{{DATA:SCREEN:SCREEN_3}}`

---

## 4. Prompt para Antigravity / LLM de Código
Use o prompt abaixo para gerar a estrutura base do frontend no seu ambiente de desenvolvimento:

```text
Atue como um desenvolvedor Frontend Senior especializado em Tailwind CSS e React. 
Implemente uma Landing Page para o "Semgrep CLI Visualizer" com as seguintes especificações:

1. Estética: Dark Mode Cybersecurity (Slate 950/900).
2. Seções: 
   - Hero com título "Transforme Scans de Segurança em Insights Executivos".
   - Dropzone para upload de arquivo JSON.
   - Grid de 3 colunas detalhando funcionalidades: "100% Client-Side", "OWASP Safe", "Executive Scoring".
   - Workflow visual de 3 passos (Terminal -> Browser -> Dashboard).
3. Componentes: Use Glassmorphism (bg-slate-900/50 backdrop-blur) e bordas sutis.
4. Stack sugerida: React + Vite + Tailwind CSS + Lucide React (ícones).
5. Segurança: Enfatize que nenhum dado sai do navegador do usuário.
```

---

## 5. Estrutura de Código Sugerida (CSS/JSX)

### Configuração Tailwind (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#020617',
        surface: '#0F172A',
        border: '#1E293B',
        primary: '#6366F1',
      },
    },
  },
}
```

### Componente de Card Executivo (Exemplo)
```jsx
const SecurityCard = ({ title, description, icon: Icon }) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
    <Icon className="w-8 h-8 text-indigo-500 mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
  </div>
);
```
