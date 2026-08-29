#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script Gerador do Relatório de Auditoria de Segurança em PDF
Semgrep CLI Visualizer & Executive Dashboard
"""

import os
import sys
import html
from datetime import datetime

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable, PageBreak
)
from reportlab.pdfgen import canvas

# Diretórios
AUDIT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PDF = os.path.join(AUDIT_DIR, "relatorio-auditoria-seguranca.pdf")
ASSETS_DIR = os.path.join(AUDIT_DIR, "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

# Paleta Oficial Solicitada
COLOR_CRITICAL = "#B91C1C"
COLOR_HIGH     = "#EA580C"
COLOR_MEDIUM   = "#D97706"
COLOR_LOW      = "#2563EB"
COLOR_STRENGTH = "#059669"
COLOR_BG_DARK  = "#0F172A"
COLOR_SLATE    = "#334155"
COLOR_LIGHT_BG = "#F8FAFC"
COLOR_TEXT     = "#1E293B"

def generate_charts():
    """Gera gráficos de rosca e barras para o relatório executivo"""
    
    # 1. Gráfico de Rosca (Severidade)
    fig, ax = plt.subplots(figsize=(4.2, 3.2), subplot_kw=dict(aspect="equal"))
    categories = ['Crítica', 'Alta', 'Média', 'Baixa / Info', 'Pontos Fortes']
    counts = [0, 0, 1, 2, 8]  # Contagem auditada
    chart_colors = [COLOR_CRITICAL, COLOR_HIGH, COLOR_MEDIUM, COLOR_LOW, COLOR_STRENGTH]
    
    # Filtrar apenas com valores > 0 para o donut
    active_labels = [l for l, c in zip(categories, counts) if c > 0]
    active_counts = [c for c in counts if c > 0]
    active_colors = [col for col, c in zip(chart_colors, counts) if c > 0]
    
    wedges, texts, autotexts = ax.pie(
        active_counts,
        labels=active_labels,
        autopct='%1.0f%%',
        pctdistance=0.75,
        startangle=140,
        colors=active_colors,
        textprops=dict(color="#0F172A", fontsize=8, weight="bold"),
        wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2)
    )
    for at in autotexts:
        at.set_color('white')
        at.set_fontsize(8)
        at.set_weight('bold')
    
    ax.set_title("Distribuição por Severidade", fontsize=10, weight="bold", pad=10, color="#0F172A")
    plt.tight_layout()
    donut_path = os.path.join(ASSETS_DIR, "chart_severity_donut.png")
    plt.savefig(donut_path, dpi=300, bbox_inches='tight')
    plt.close()

    # 2. Gráfico de Barras (Status por Categoria Auditada)
    fig, ax = plt.subplots(figsize=(5.2, 3.2))
    cat_names = [
        '1. Banco/Tenant\n(RAM/Zero-DB)',
        '2. Permissão UI\n(Zero-Auth)',
        '3. IDOR\n(In-Memory IDs)',
        '4. Chaves Exp.\n(Gitleaks/CI)',
        '5. XSS/Inputs\n(DOMPurify/Zod)'
    ]
    strengths = [2, 1, 1, 2, 2]
    findings  = [0, 0, 0, 0, 3] # 1 Média (deps) + 2 Baixas/Info (CSP/MIME)

    x = np.arange(len(cat_names))
    width = 0.35

    rects1 = ax.bar(x - width/2, strengths, width, label='Controles Verificados', color=COLOR_STRENGTH, edgecolor='none', zorder=3)
    rects2 = ax.bar(x + width/2, findings, width, label='Achados / Melhorias', color=COLOR_MEDIUM, edgecolor='none', zorder=3)

    ax.set_ylabel('Qtd. Itens Auditados', fontsize=8, weight='bold', color='#334155')
    ax.set_title('Conformidade por Categoria Auditada', fontsize=10, weight='bold', pad=10, color='#0F172A')
    ax.set_xticks(x)
    ax.set_xticklabels(cat_names, fontsize=7, color='#1E293B')
    ax.legend(fontsize=8, frameon=True, facecolor='#F8FAFC', edgecolor='#E2E8F0')
    ax.grid(axis='y', linestyle='--', alpha=0.5, zorder=0)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#94A3B8')
    ax.spines['bottom'].set_color('#94A3B8')

    plt.tight_layout()
    bar_path = os.path.join(ASSETS_DIR, "chart_category_bar.png")
    plt.savefig(bar_path, dpi=300, bbox_inches='tight')
    plt.close()

    return donut_path, bar_path


class NumberedCanvas(canvas.Canvas):
    """Canvas de dois passos para numeração dinâmica de páginas (Página X de Y) e cabeçalho/rodapé"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Não desenha cabeçalho/rodapé na capa (Página 1)
        if self._pageNumber > 1:
            # Cabeçalho Superior
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor(COLOR_BG_DARK))
            self.drawString(20 * mm, 282 * mm, "RELATÓRIO DE AUDITORIA DE SEGURANÇA")
            
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(190 * mm, 282 * mm, "Semgrep CLI Visualizer v1.2.0")
            
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

            # Rodapé Inferior
            self.line(20 * mm, 18 * mm, 190 * mm, 18 * mm)
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(20 * mm, 13 * mm, "Confidencial • Auditoria de Segurança Estática & Arquitetural")
            
            page_text = f"Página {self._pageNumber} de {page_count}"
            self.drawRightString(190 * mm, 13 * mm, page_text)

        self.restoreState()


def format_markdown_issue_for_pdf(text):
    """Converte markdown em HTML seguro para ReportLab Paragraph"""
    escaped = html.escape(text)
    # Substituir tags formatadas
    formatted = escaped.replace('\n', '<br/>')
    # Permitir negrito e código de tags de issue
    formatted = formatted.replace('&lt;b&gt;', '<b>').replace('&lt;/b&gt;', '</b>')
    return formatted


def build_pdf(donut_chart_path, bar_chart_path):
    """Constrói o documento PDF com ReportLab"""
    
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=22 * mm
    )

    styles = getSampleStyleSheet()

    # Estilos customizados
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor(COLOR_BG_DARK),
        alignment=0
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#475569"),
        alignment=0
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor(COLOR_BG_DARK),
        spaceBefore=11,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor(COLOR_TEXT),
        spaceAfter=5
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F8FAFC"),
        borderPadding=5,
        spaceBefore=3,
        spaceAfter=5
    )

    story = []

    # =========================================================================
    # 1. CAPA & NOTA METODOLÓGICA (PÁGINA 1)
    # =========================================================================
    story.append(Spacer(1, 8 * mm))
    
    badge_table = Table(
        [[Paragraph("<b>AUDITORIA DE SEGURANÇA TÉCNICA (CODE REVIEW & ARCHITECTURE)</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor(COLOR_LOW)))]],
        colWidths=[170 * mm]
    )
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BORDER', (0, 0), (-1, -1), 1, colors.HexColor("#BFDBFE")),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Relatório de Auditoria de Segurança", title_style))
    story.append(Paragraph("Semgrep CLI Visualizer & Executive Dashboard", ParagraphStyle('Sub', parent=title_style, fontSize=16, leading=20, textColor=colors.HexColor("#4F46E5"))))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Avaliação Técnica Sistemática contra as 5 Falhas Críticas de Aplicação e Infraestrutura", subtitle_style))
    
    story.append(Spacer(1, 4 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4F46E5"), spaceAfter=10))

    meta_data = [
        [Paragraph("<b>Projeto Auditado:</b>", body_style), Paragraph("Semgrep CLI Visualizer (SPA)", body_style), Paragraph("<b>Versão Base:</b>", body_style), Paragraph("v1.2.0 (Produção)", body_style)],
        [Paragraph("<b>Data da Auditoria:</b>", body_style), Paragraph("29 de Agosto de 2026", body_style), Paragraph("<b>Ambiente:</b>", body_style), Paragraph("Nginx Alpine Unprivileged + Docker", body_style)],
        [Paragraph("<b>Domínio de Produção:</b>", body_style), Paragraph("semgrep.brunoizidorio.com.br", body_style), Paragraph("<b>Esteira CI/CD:</b>", body_style), Paragraph("GitLab CI (DevSecOps Gitleaks/Trivy)", body_style)],
        [Paragraph("<b>Classificação:</b>", body_style), Paragraph("<font color='#059669'><b>Conforme / Hardened (Grade A+)</b></font>", body_style), Paragraph("<b>Auditor:</b>", body_style), Paragraph("Security-First AI Agent (Antigravity v2.0)", body_style)],
    ]
    meta_table = Table(meta_data, colWidths=[38 * mm, 47 * mm, 38 * mm, 47 * mm])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(COLOR_LIGHT_BG)),
        ('BORDER', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("1. Detecção da Stack & Mapeamento Metodológico", h1_style))
    story.append(Paragraph(
        "A auditoria iniciou com a inspeção da arquitetura e arquivos de configuração para mapear as 5 categorias de vulnerabilidades solicitadas para o equivalente exato da stack do projeto:",
        body_style
    ))

    stack_map_data = [
        [Paragraph("<b>Categoria Auditada</b>", body_style), Paragraph("<b>Stack Detectada</b>", body_style), Paragraph("<b>Equivalência Metodológica Aplicada</b>", body_style)],
        [
            Paragraph("<b>1. Banco sem Tranca</b>", body_style),
            Paragraph("Zero Backend / Zero DB<br/>React 18 + Zustand RAM", body_style),
            Paragraph("<b>Isolamento de Memória & Zero-Persistence:</b> Garantia de que relatórios SAST confidenciais fiquem apenas em RAM volátil, sem persistência em <code>localStorage</code>, <code>IndexedDB</code> ou Service Worker.", body_style)
        ],
        [
            Paragraph("<b>2. Permissão no Browser</b>", body_style),
            Paragraph("Zero-Auth / Static SPA<br/>Nenhum backend RBAC", body_style),
            Paragraph("<b>Avaliação de Superfície de Privilégio:</b> Validação de que não existem papéis fictícios no frontend escondendo rotas críticas sem backend correspondente.", body_style)
        ],
        [
            Paragraph("<b>3. IDOR</b>", body_style),
            Paragraph("Zero API endpoints<br/>IDs sintéticos in-memory", body_style),
            Paragraph("<b>Integridade de Referência em Memória:</b> Validação de que identificadores de achados não acionam requisições HTTP externas e operam estritamente no escopo da sessão local.", body_style)
        ],
        [
            Paragraph("<b>4. Chaves Expostas</b>", body_style),
            Paragraph("GitLab CI, Dockerfile,<br/>Nginx, gitleaks, configs", body_style),
            Paragraph("<b>Hardcode & Defaults Scanner:</b> Auditoria do histórico git, variáveis de CI/CD, docker-compose, configs Nginx e bundles em busca de secrets reais ou defaults inseguros.", body_style)
        ],
        [
            Paragraph("<b>5. Inputs sem Tratamento (XSS)</b>", body_style),
            Paragraph("React JSX, DOMPurify,<br/>Zod Schemas, CSP Nginx", body_style),
            Paragraph("<b>Blindagem DOM & Sanitização:</b> Busca por <code>dangerouslySetInnerHTML</code>, <code>eval</code>, injeção de HTML em mensagens/código de relatórios e cobertura com DOMPurify.", body_style)
        ],
    ]

    stack_table = Table(stack_map_data, colWidths=[38 * mm, 38 * mm, 94 * mm])
    stack_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(COLOR_BG_DARK)),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor(COLOR_LIGHT_BG)]),
    ]))
    story.append(stack_table)

    story.append(PageBreak())

    # =========================================================================
    # 2. RESUMO EXECUTIVO & GRÁFICOS (PÁGINA 2)
    # =========================================================================
    story.append(Paragraph("2. Resumo Executivo da Auditoria", h1_style))
    story.append(Paragraph(
        "A análise estática e arquitetural atesta que a aplicação implementa um padrão exemplar de <b>Segurança por Design (Security-by-Design)</b>, operando com arquitetura <b>Zero-Persistence</b> e processamento 100% no lado do cliente. Não foram identificadas vulnerabilidades Críticas ou Altas no código-fonte do produto.",
        body_style
    ))

    sev_summary_data = [
        [
            Paragraph("<b>Crítica (P1)</b>", body_style),
            Paragraph("<b>Alta (P2)</b>", body_style),
            Paragraph("<b>Média (P3)</b>", body_style),
            Paragraph("<b>Baixa / Info (P4/P5)</b>", body_style),
            Paragraph("<b>Pontos Fortes (Conformes)</b>", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_CRITICAL}' size=13><b>0</b></font>", ParagraphStyle('C', alignment=1)),
            Paragraph(f"<font color='{COLOR_HIGH}' size=13><b>0</b></font>", ParagraphStyle('C', alignment=1)),
            Paragraph(f"<font color='{COLOR_MEDIUM}' size=13><b>1</b></font>", ParagraphStyle('C', alignment=1)),
            Paragraph(f"<font color='{COLOR_LOW}' size=13><b>2</b></font>", ParagraphStyle('C', alignment=1)),
            Paragraph(f"<font color='{COLOR_STRENGTH}' size=13><b>8</b></font>", ParagraphStyle('C', alignment=1)),
        ]
    ]
    sev_table = Table(sev_summary_data, colWidths=[34 * mm, 34 * mm, 34 * mm, 34 * mm, 34 * mm])
    sev_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#FEF2F2")),
        ('BACKGROUND', (1, 0), (1, -1), colors.HexColor("#FFF7ED")),
        ('BACKGROUND', (2, 0), (2, -1), colors.HexColor("#FFFBEB")),
        ('BACKGROUND', (3, 0), (3, -1), colors.HexColor("#EFF6FF")),
        ('BACKGROUND', (4, 0), (4, -1), colors.HexColor("#ECFDF5")),
        ('BORDER', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(sev_table)
    story.append(Spacer(1, 4 * mm))

    chart_table = Table([
        [
            Image(donut_chart_path, width=78 * mm, height=56 * mm),
            Image(bar_chart_path, width=90 * mm, height=56 * mm)
        ]
    ], colWidths=[80 * mm, 90 * mm])
    chart_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(chart_table)
    story.append(Spacer(1, 3 * mm))

    story.append(Paragraph("3. Análise Comparativa: Pontos Fortes vs. Riscos Residuais", h1_style))

    strengths_weaknesses_data = [
        [Paragraph("<b>🛡️ PONTOS FORTES COMPROVADOS (EVIDÊNCIAS NO CÓDIGO)</b>", body_style), Paragraph("<b>⚠️ RISCOS CENTRAIS & MELHORIAS</b>", body_style)],
        [
            Paragraph(
                "• <b>Isolamento Total em Memória:</b> O arquivo <code>useSemgrepStore.ts:14-46</code> mantém os relatórios unicamente na store Zustand volátil. O <code>localStorage</code> é restrito a <code>semgrep_app_lang</code> (LanguageContext.tsx:10-29).<br/>"
                "• <b>Proteção XSS Rigorosa:</b> O <code>CodeViewerModal.tsx</code> e <code>VulnerabilityTable.tsx</code> executam <code>sanitizeText()</code> (DOMPurify estrito sem tags) em 100% dos nós textuais vindos do JSON.<br/>"
                "• <b>Gitleaks Bloqueante no CI:</b> <code>.gitlab/ci/security.gitlab-ci.yml:21-34</code> roda Gitleaks impeditivo sem <code>allow_failure: true</code>.<br/>"
                "• <b>Nginx Unprivileged Hardened:</b> Dockerfile usa <code>nginxinc/nginx-unprivileged:alpine-slim</code> com UID 101 e porta 8080.<br/>"
                "• <b>Validação Zod & Teto DoS:</b> <code>semgrep.schema.ts</code> usa <code>.strip()</code> e <code>webMcp.ts:45</code> limita payloads a 50MB.",
                body_style
            ),
            Paragraph(
                "• <b>Vulnerabilidades em Dependências de Dev (NPM Audit):</b> Identificados advisories moderados em <code>dompurify &lt;=3.4.12</code> e no ambiente de desenvolvimento/testes (<code>vite &lt;=6.4.2</code>, <code>vitest &lt;=3.2.5</code>, <code>nanoid &lt;3.3.18</code>).<br/><br/>"
                "• <b>CSP Explicit Hardening:</b> O Nginx possui CSP com hashes rigorosos, porém pode ser reforçado explicitando <code>object-src 'none'</code> e <code>base-uri 'self'</code> para padrões DevSecOps militares.<br/><br/>"
                "• <b>Validação de MIME Type no FileDropzone:</b> O leitor de arquivos valida extensão <code>.json</code> e faz parsing seguro com Zod, mas a checagem prévia de MIME pode ser adicionada defensivamente.",
                body_style
            )
        ]
    ]
    sw_table = Table(strengths_weaknesses_data, colWidths=[85 * mm, 85 * mm])
    sw_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#ECFDF5")),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor("#FFFBEB")),
        ('BACKGROUND', (0, 1), (0, 1), colors.white),
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor(COLOR_LIGHT_BG)),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(sw_table)

    story.append(PageBreak())

    # =========================================================================
    # 4. TABELA DE ACHADOS DETALHADOS POR CATEGORIA (PÁGINA 3)
    # =========================================================================
    story.append(Paragraph("4. Tabela de Achados Detalhados & Controles Verificados", h1_style))
    story.append(Paragraph(
        "A tabela a seguir discrimina cada controle verificado no código-fonte, evidenciando as linhas auditadas, o estado de conformidade e as oportunidades de remediação.",
        body_style
    ))

    findings_table_data = [
        [
            Paragraph("<b>Sev.</b>", body_style),
            Paragraph("<b>Cat.</b>", body_style),
            Paragraph("<b>Arquivo : Linha</b>", body_style),
            Paragraph("<b>Descrição Técnica & Status Verificado</b>", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("1. Banco", body_style),
            Paragraph("<code>frontend/src/store/<br/>useSemgrepStore.ts:14-46</code>", body_style),
            Paragraph("<b>Isolamento em RAM e Reset Volátil:</b> Estado armazenado unicamente em memória volátil Zustand. Função <code>reset()</code> limpa instantaneamente o relatório.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("1. Banco", body_style),
            Paragraph("<code>frontend/src/context/<br/>LanguageContext.tsx:10-30</code>", body_style),
            Paragraph("<b>Zero-Persistence no LocalStorage:</b> Restrito unicamente à preferência de idioma <code>semgrep_app_lang</code> com allowlist estrita (<code>pt-BR</code>, <code>en-US</code>).", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("2. Perm.", body_style),
            Paragraph("<code>frontend/src/App.tsx:17-67</code>", body_style),
            Paragraph("<b>Arquitetura Zero-Auth:</b> Inexistência de papéis fictícios no client (ex: <code>isAdmin</code>). Operações de UI atuam apenas sobre o estado in-memory.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("3. IDOR", body_style),
            Paragraph("<code>frontend/src/services/<br/>defectdojo.adapter.ts:111</code>", body_style),
            Paragraph("<b>IDs Sintéticos Locais:</b> Geração de IDs in-memory (<code>finding-index-checkId</code>) sem requisições HTTP REST/CRUD para servidores externos.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("4. Chaves", body_style),
            Paragraph("<code>.gitlab/ci/<br/>security.gitlab-ci.yml:21</code>", body_style),
            Paragraph("<b>Gitleaks Bloqueante no CI:</b> Scanner de segredos ativo sem <code>allow_failure: true</code>, impedindo promoção de credenciais reais.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("4. Chaves", body_style),
            Paragraph("<code>.gitlab/ci/<br/>deploy.gitlab-ci.yml:18</code>", body_style),
            Paragraph("<b>Secrets via Variáveis CI/CD:</b> Autenticação no Docker Registry via <code>$CI_REGISTRY_USER</code> e <code>$CI_REGISTRY_PASSWORD</code>; zero segredos hardcoded.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("5. XSS", body_style),
            Paragraph("<code>frontend/src/components/<br/>CodeViewerModal.tsx:135-183</code>", body_style),
            Paragraph("<b>Sanitização Integral no Modal:</b> Uso sistemático de <code>sanitizeText()</code> em título, checkId, path, rationale, message e snippet de código.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_STRENGTH}'><b>FORTE</b></font>", body_style),
            Paragraph("5. XSS", body_style),
            Paragraph("<code>frontend/src/models/<br/>semgrep.schema.ts:22-23</code>", body_style),
            Paragraph("<b>Sanitização Estrutural Zod:</b> Uso de <code>.strip()</code> para descartar propriedades desconhecidas e prevenir poluição de propriedades.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_MEDIUM}'><b>MÉDIA</b></font>", body_style),
            Paragraph("5. Deps", body_style),
            Paragraph("<code>frontend/package.json:13-38</code>", body_style),
            Paragraph("<b>Atualização de Dependências (NPM Audit):</b> <code>dompurify &lt;=3.4.12</code> e ferramentas de desenvolvimento (<code>vite/vitest</code>) possuem correções disponíveis.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_LOW}'><b>BAIXA</b></font>", body_style),
            Paragraph("5. Nginx", body_style),
            Paragraph("<code>frontend/nginx.conf:22, 145</code>", body_style),
            Paragraph("<b>Reforço de Diretivas CSP:</b> Adicionar explicitamente <code>object-src 'none'</code> e <code>base-uri 'self'</code> na Content-Security-Policy do Nginx.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_LOW}'><b>INFO</b></font>", body_style),
            Paragraph("5. UI", body_style),
            Paragraph("<code>frontend/src/components/<br/>FileDropzone.tsx:39-50</code>", body_style),
            Paragraph("<b>Defesa em Profundidade no Dropzone:</b> Validar <code>file.type === 'application/json'</code> em conjunto com a extensão para rejeitar arquivos adulterados.", body_style)
        ],
    ]

    findings_table = Table(findings_table_data, colWidths=[18 * mm, 18 * mm, 48 * mm, 86 * mm])
    findings_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(COLOR_BG_DARK)),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 3.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor(COLOR_LIGHT_BG)]),
    ]))
    story.append(findings_table)

    story.append(PageBreak())

    # =========================================================================
    # 5. RECOMENDAÇÕES PRIORIZADAS & ISSUE 1 (PÁGINA 4)
    # =========================================================================
    story.append(Paragraph("5. Plano de Recomendações Priorizadas", h1_style))
    story.append(Paragraph(
        "As melhorias recomendadas visam elevar a postura de segurança da esteira e do cliente ao estado da arte:",
        body_style
    ))

    rec_data = [
        [
            Paragraph("<b>Prioridade</b>", body_style),
            Paragraph("<b>Ação Recomendada</b>", body_style),
            Paragraph("<b>Impacto / Rationale</b>", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_HIGH}' size=9><b>P1 (Alta)</b></font>", body_style),
            Paragraph("<b>Atualização do DOMPurify e Toolchain de Testes</b><br/>Executar <code>npm audit fix</code> ou atualizar <code>dompurify &gt;=3.2.0</code> e <code>vitest</code>.", body_style),
            Paragraph("Elimina advisories de vulnerabilidade conhecidos em dependências diretas e de desenvolvimento.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_MEDIUM}' size=9><b>P2 (Média)</b></font>", body_style),
            Paragraph("<b>Reforço Estrito de Diretivas CSP no Nginx</b><br/>Incluir <code>object-src 'none'; base-uri 'self';</code> no header <code>Content-Security-Policy</code> de <code>frontend/nginx.conf</code>.", body_style),
            Paragraph("Bloqueia injeções via plugins de objetos (Flash/Java) e manipulações da tag <code>&lt;base&gt;</code>.", body_style)
        ],
        [
            Paragraph(f"<font color='{COLOR_LOW}' size=9><b>P3 (Baixa)</b></font>", body_style),
            Paragraph("<b>Validação de MIME Type Defensiva no Dropzone</b><br/>Adicionar checagem de <code>file.type</code> em <code>FileDropzone.tsx</code> antes do <code>readAsText()</code>.", body_style),
            Paragraph("Reforça a defesa em profundidade rejeitando arquivos binários renomeados para .json.", body_style)
        ],
    ]

    rec_table = Table(rec_data, colWidths=[24 * mm, 70 * mm, 76 * mm])
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(COLOR_BG_DARK)),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor(COLOR_LIGHT_BG)]),
    ]))
    story.append(rec_table)
    story.append(Spacer(1, 5 * mm))

    # Início da Seção de Issues
    story.append(Paragraph("6. Issues para o GitHub / GitLab (Prontas para Uso)", h1_style))
    story.append(Paragraph(
        "Blocos delimitados formatados em Markdown prontos para inclusão no rastreador de issues:",
        body_style
    ))

    issue1_raw = """--- ISSUE 1 ---
### [Segurança] Atualização de dependências com alertas no NPM Audit (DOMPurify, Vite, Vitest)
**Labels sugeridas:** security, severity:medium, dependencies

#### 1. Descrição do Problema
A execução do comando npm audit no diretório frontend/ revelou alertas de segurança moderados:
- dompurify <=3.4.12: Hook removal edge case que pode permitir execução de subárvores desanexadas.
- esbuild/vite <=6.4.2 e vitest <=3.2.5: Vulnerabilidades no servidor de desenvolvimento local.

#### 2. Evidência
- Arquivo: frontend/package.json:13-38 e frontend/package-lock.json

#### 3. Impacto
Baixo risco em produção (o bundle estático gerado roda via Nginx sem o dev server do Vite/Vitest), porém viola os critérios de governança e auditoria automatizada DevSecOps (Trivy FS Scan).

#### 4. Sugestão de Correção
Atualizar as dependências no frontend/package.json para versões estáveis corrigidas:
$ cd frontend && npm update dompurify && npm audit fix

#### 5. Critérios de Aceite
- [ ] npm audit executado em frontend/ retorna 0 vulnerabilidades em dependências de produção.
- [ ] Suíte de testes unitários (npm test) passa com 100% de sucesso.
- [ ] Build de produção (npm run build) conclui sem erros de tipagem TypeScript.
--- FIM ISSUE 1 ---"""

    story.append(Paragraph(format_markdown_issue_for_pdf(issue1_raw), code_style))

    story.append(PageBreak())

    # =========================================================================
    # 6. ISSUES 2 E 3 + CHECKLIST FINAL (PÁGINA 5)
    # =========================================================================
    story.append(Paragraph("6. Issues para o GitHub / GitLab (Continuação)", h1_style))

    issue2_raw = """--- ISSUE 2 ---
### [Segurança] Reforço de diretivas CSP no Nginx (object-src e base-uri)
**Labels sugeridas:** security, severity:low, nginx, hardening

#### 1. Descrição do Problema
O cabeçalho Content-Security-Policy em frontend/nginx.conf define default-src 'self' e hashes estritos, mas não explicita as diretivas object-src 'none' e base-uri 'self'.

#### 2. Evidência
- Arquivo: frontend/nginx.conf:22 e frontend/nginx.conf:145

#### 3. Impacto
Sem a diretiva explícita object-src 'none', navegadores legados poderiam permitir a injeção de elementos <object>, <embed> ou <applet>. A ausência de base-uri 'self' poderia permitir a manipulação da tag <base> caso houvesse falha de injeção no HTML.

#### 4. Sugestão de Correção
Adicionar object-src 'none'; base-uri 'self'; às diretivas CSP do Nginx:
add_header Content-Security-Policy "default-src 'self'; object-src 'none'; base-uri 'self'; script-src 'self' 'sha256-...' ...;" always;

#### 5. Critérios de Aceite
- [ ] frontend/nginx.conf atualizado com object-src 'none' e base-uri 'self'.
- [ ] Teste de configuração Nginx (nginx.config.test.ts) atualizado e aprovado.
- [ ] Resposta HTTP do container em http://localhost:8080 retorna os novos cabeçalhos.
--- FIM ISSUE 2 ---"""

    story.append(Paragraph(format_markdown_issue_for_pdf(issue2_raw), code_style))
    story.append(Spacer(1, 3 * mm))

    issue3_raw = """--- ISSUE 3 ---
### [Segurança] Validação defensiva de MIME Type no FileDropzone (Defense-in-Depth)
**Labels sugeridas:** security, severity:low, client-security

#### 1. Descrição do Problema
O componente FileDropzone valida a extensão (.json) e executa o parsing via Zod, mas não valida o MIME Type file.type antes de iniciar a leitura com FileReader.readAsText().

#### 2. Evidência
- Arquivo: frontend/src/components/common/FileDropzone.tsx:39-50

#### 3. Impacto
Arquivos binários grandes ou arquivos renomeados para .json podem disparar tentativas desnecessárias de leitura em memória antes do descarte pelo Zod parser.

#### 4. Sugestão de Correção
Validar se file.type é vazio ou 'application/json' antes da leitura:
if (file.type && file.type !== 'application/json') { alert(t('jsonErrorAlert')); return; }

#### 5. Critérios de Aceite
- [ ] Validação de MIME Type implementada em FileDropzone.tsx.
- [ ] Testes de UI cobrindo rejeição de arquivos não-JSON com feedback imediato.
--- FIM ISSUE 3 ---"""

    story.append(Paragraph(format_markdown_issue_for_pdf(issue3_raw), code_style))
    story.append(Spacer(1, 4 * mm))

    # Conclusão e Assinatura
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=6))
    story.append(Paragraph(
        "<b>Conclusão da Auditoria:</b> O projeto <b>Semgrep CLI Visualizer v1.2.0</b> apresenta conformidade exemplar com as melhores práticas de privacidade client-side e AppSec. A implementação das 3 issues recomendadas consolidará o padrão de excelência DevSecOps.",
        body_style
    ))

    # Constrói documento com NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ Relatório de Auditoria gerado com sucesso em: {OUTPUT_PDF}")


if __name__ == "__main__":
    donut_p, bar_p = generate_charts()
    build_pdf(donut_p, bar_p)
