export type Language = 'pt-BR' | 'en-US';

export const translations = {
  'pt-BR': {
    headerTitle: 'Semgrep CLI Visualizer',
    subtitle: 'Visualizador Executivo Zero-Persistence Client-Side',
    exportPdf: 'Exportar PDF',
    newScan: 'Novo Scan / Início',
    home: 'Página Inicial',
    dropzoneTitle: 'Arraste seu arquivo resultado_semgrep.json aqui',
  },
  'en-US': {
    headerTitle: 'Semgrep CLI Visualizer',
    subtitle: 'Zero-Persistence Client-Side Executive Visualizer',
    exportPdf: 'Export PDF',
    newScan: 'New Scan / Home',
    home: 'Home Page',
    dropzoneTitle: 'Drop your resultado_semgrep.json file here',
  },
} as const;

export type TranslationKey = keyof typeof translations['pt-BR'];
