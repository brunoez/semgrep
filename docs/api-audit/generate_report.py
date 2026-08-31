#!/usr/bin/env python3
"""
Script de Geração de Relatório de Auditoria de APIs e Segurança (OWASP API Top 10)
Projeto: Semgrep CLI Visualizer & Executive Dashboard
Autor: Principal API Engineer & AppSec Specialist
"""

import os
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Paleta Oficial
COLOR_CRITICA = colors.HexColor('#B91C1C')
COLOR_ALTA = colors.HexColor('#EA580C')
COLOR_MEDIA = colors.HexColor('#D97706')
COLOR_BAIXA = colors.HexColor('#2563EB')
COLOR_FORTE = colors.HexColor('#059669')
COLOR_PRIMARY = colors.HexColor('#4F46E5')
COLOR_DARK = colors.HexColor('#0F172A')
COLOR_SLATE_DARK = colors.HexColor('#1E293B')
COLOR_SLATE_MID = colors.HexColor('#475569')
COLOR_SLATE_LIGHT = colors.HexColor('#94A3B8')
COLOR_BG_LIGHT = colors.HexColor('#F8FAFC')
COLOR_BORDER = colors.HexColor('#E2E8F0')

class NumberedCanvas(canvas.Canvas):
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
        if self._pageNumber == 1:
            # Capa: não desenhar cabeçalho/rodapé padrão
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor('#64748B'))

        # Cabeçalho
        self.drawString(54, 842 - 36, "RELATÓRIO DE AUDITORIA DE APIS E SEGURANÇA (OWASP API TOP 10)")
        self.setFont("Helvetica", 8)
        self.drawRightString(595 - 54, 842 - 36, "Semgrep CLI Visualizer — v1.2.0")
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(0.5)
        self.line(54, 842 - 42, 595 - 54, 842 - 42)

        # Rodapé
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(0.5)
        self.line(54, 45, 595 - 54, 45)
        self.setFont("Helvetica", 8)
        self.drawString(54, 32, "Confidencial • Auditoria Técnica de Segurança de APIs")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(595 - 54, 32, page_text)
        self.restoreState()


def generate_charts(output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Gráfico de Rosca: Achados por Severidade
    labels = ['Crítica (0)', 'Alta (3)', 'Média (3)', 'Baixa (4)']
    sizes = [0, 3, 3, 4]
    pie_colors = ['#B91C1C', '#EA580C', '#D97706', '#2563EB']
    
    non_zero_sizes = [s for s in sizes if s > 0]
    non_zero_labels = [labels[i] for i, s in enumerate(sizes) if s > 0]
    non_zero_colors = [pie_colors[i] for i, s in enumerate(sizes) if s > 0]

    fig, ax = plt.subplots(figsize=(4.5, 3.0), subplot_kw=dict(aspect="equal"))
    wedges, texts, autotexts = ax.pie(
        non_zero_sizes,
        labels=non_zero_labels,
        autopct='%1.0f%%',
        pctdistance=0.75,
        startangle=140,
        colors=non_zero_colors,
        textprops=dict(color="#1E293B", size=8.5, weight="bold"),
        wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2)
    )
    for at in autotexts:
        at.set_color('white')
        at.set_fontsize(8.5)
        at.set_weight('bold')

    ax.set_title("Distribuição por Severidade", fontsize=10.5, fontweight='bold', color='#0F172A', pad=10)
    plt.tight_layout()
    pie_path = os.path.join(output_dir, 'chart_severity.png')
    plt.savefig(pie_path, dpi=200, bbox_inches='tight', transparent=True)
    plt.close()

    # 2. Gráfico de Barras: Achados por Categoria
    categories = [
        'Resiliência & DoS',
        'Contrato & Rotas API',
        'WebMCP & Integridade',
        'Headers & Hardening',
        'Sanitização & Dados',
        'Infra & Container'
    ]
    counts = [3, 2, 1, 1, 2, 1]
    bar_colors = ['#EA580C', '#EA580C', '#D97706', '#D97706', '#2563EB', '#2563EB']

    fig, ax = plt.subplots(figsize=(5.0, 3.0))
    y_pos = np.arange(len(categories))
    bars = ax.barh(y_pos, counts, align='center', color=bar_colors, height=0.55, edgecolor='none')
    ax.set_yticks(y_pos)
    ax.set_yticklabels(categories, fontsize=8, fontweight='bold', color='#334155')
    ax.invert_yaxis()
    ax.set_xlabel('Quantidade de Achados', fontsize=8.5, fontweight='bold', color='#475569')
    ax.set_title('Achados por Categoria de Auditoria', fontsize=10.5, fontweight='bold', color='#0F172A', pad=10)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#CBD5E1')
    ax.spines['bottom'].set_color('#CBD5E1')
    ax.xaxis.grid(True, linestyle='--', alpha=0.5, color='#CBD5E1')
    ax.set_axisbelow(True)

    for bar in bars:
        width = bar.get_width()
        ax.text(width + 0.08, bar.get_y() + bar.get_height()/2, f'{int(width)}',
                ha='left', va='center', fontsize=8.5, fontweight='bold', color='#1E293B')

    ax.set_xlim(0, 4)
    plt.tight_layout()
    bar_path = os.path.join(output_dir, 'chart_categories.png')
    plt.savefig(bar_path, dpi=200, bbox_inches='tight', transparent=True)
    plt.close()

    return pie_path, bar_path


def build_pdf(filename="docs/api-audit/relatorio-auditoria-api.pdf"):
    output_dir = os.path.dirname(os.path.abspath(filename))
    os.makedirs(output_dir, exist_ok=True)
    pie_img, bar_img = generate_charts(output_dir)

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=27,
        textColor=COLOR_DARK,
        alignment=0,
        spaceAfter=8
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=COLOR_PRIMARY,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=COLOR_DARK,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=COLOR_SLATE_DARK,
        spaceAfter=6
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_SLATE_DARK
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#0F172A')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=COLOR_SLATE_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=COLOR_SLATE_DARK
    )

    story = []

    # ==================== 1. CAPA ====================
    story.append(Spacer(1, 15))
    badge_table = Table([[
        Paragraph("<b>RELATÓRIO TÉCNICO DE AUDITORIA DE SEGURANÇA DE APIS</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=COLOR_PRIMARY))
    ]], colWidths=[270])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2FF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C7D2FE')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph("Relatório de Auditoria de APIs, Segurança (OWASP API Top 10) e Performance", title_style))
    story.append(Paragraph("Semgrep CLI Visualizer & Executive Dashboard", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=COLOR_PRIMARY, spaceBefore=0, spaceAfter=16))

    meta_data = [
        [Paragraph("<b>Projeto Auditado:</b>", table_cell_bold), Paragraph("Semgrep CLI Visualizer (SPA Client-Side + Nginx + WebMCP)", table_cell_style)],
        [Paragraph("<b>Domínio de Produção:</b>", table_cell_bold), Paragraph("https://semgrep.brunoizidorio.com.br", table_cell_style)],
        [Paragraph("<b>Data da Auditoria:</b>", table_cell_bold), Paragraph("31 de Agosto de 2026", table_cell_style)],
        [Paragraph("<b>Auditor Responsável:</b>", table_cell_bold), Paragraph("Principal API Engineer & AppSec Specialist (Antigravity v2.0)", table_cell_style)],
        [Paragraph("<b>Metodologia Aplicada:</b>", table_cell_bold), Paragraph("OWASP API Security Top 10 (2023), STRIDE Threat Modeling, RFC 8288 / 8414 / 9727 / 9728", table_cell_style)],
        [Paragraph("<b>Classificação:</b>", table_cell_bold), Paragraph("<font color='#B91C1C'><b>Confidencial — Uso Interno de Engenharia</b></font>", table_cell_style)],
    ]
    meta_table = Table(meta_data, colWidths=[120, 367])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # Nota Metodológica
    metodologia_box = [
        [Paragraph("<b>NOTA METODOLÓGICA & ESCOPO DA ARQUITETURA</b>", ParagraphStyle('HMet', fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=COLOR_DARK))],
        [Paragraph(
            "O <b>Semgrep CLI Visualizer</b> opera sob o paradigma <b>100% Client-Side / Zero-Persistence</b>, onde todo o processamento de parsing de relatórios SAST, validação via esquemas Zod e cálculo de scores executivos ocorre exclusivamente na memória RAM local do navegador do usuário.<br/><br/>"
            "Dada a ausência de um backend tradicional de banco de dados e APIs REST CRUD, a auditoria cobriu com rigor extremo a <b>superfície de interfaces e rotas expostas</b>: "
            "(1) Servidor Nginx de produção e conformidade de rotas <code>/.well-known/</code> de descoberta de IA (RFC 9727, RFC 8414, RFC 9728, SEP-1649); "
            "(2) Ferramentas WebMCP in-browser (<code>navigator.modelContext.provideContext</code>); "
            "(3) Resiliência e mitigação de DoS no upload/drag-and-drop de arquivos JSON pesados; "
            "(4) Cabeçalhos de segurança HTTP, isolamento de origem (COOP/COEP/CORP) e políticas de CSP; "
            "(5) Service Worker e integridade do cache PWA; "
            "(6) Hardening do contêiner Docker multi-stage (UID 101 não-root).",
            callout_style
        )]
    ]
    metodologia_table = Table(metodologia_box, colWidths=[487])
    metodologia_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(metodologia_table)

    story.append(PageBreak())

    # ==================== 2. RESUMO EXECUTIVO ====================
    story.append(Paragraph("1. Resumo Executivo & Métricas Globais", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_SLATE_LIGHT, spaceBefore=2, spaceAfter=10))

    summary_cards = [
        [
            Paragraph("<b>CRÍTICA</b><br/><font size=15 color='#B91C1C'><b>0</b></font><br/><font size=6.5 color='#64748B'>0% do total</font>", ParagraphStyle('CardC', alignment=1)),
            Paragraph("<b>ALTA</b><br/><font size=15 color='#EA580C'><b>3</b></font><br/><font size=6.5 color='#64748B'>30% do total</font>", ParagraphStyle('CardA', alignment=1)),
            Paragraph("<b>MÉDIA</b><br/><font size=15 color='#D97706'><b>3</b></font><br/><font size=6.5 color='#64748B'>30% do total</font>", ParagraphStyle('CardM', alignment=1)),
            Paragraph("<b>BAIXA</b><br/><font size=15 color='#2563EB'><b>4</b></font><br/><font size=6.5 color='#64748B'>40% do total</font>", ParagraphStyle('CardB', alignment=1)),
            Paragraph("<b>QUICK WINS</b><br/><font size=15 color='#059669'><b>7</b></font><br/><font size=6.5 color='#64748B'>70% dos itens</font>", ParagraphStyle('CardQ', alignment=1)),
        ]
    ]
    summary_table = Table(summary_cards, colWidths=[97, 97, 97, 97, 99])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#FEF2F2')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#FFF7ED')),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor('#FFFBEB')),
        ('BACKGROUND', (3,0), (3,0), colors.HexColor('#EFF6FF')),
        ('BACKGROUND', (4,0), (4,0), colors.HexColor('#ECFDF5')),
        ('BOX', (0,0), (0,0), 1, colors.HexColor('#FECACA')),
        ('BOX', (1,0), (1,0), 1, colors.HexColor('#FFEDD5')),
        ('BOX', (2,0), (2,0), 1, colors.HexColor('#FEF3C7')),
        ('BOX', (3,0), (3,0), 1, colors.HexColor('#DBEAFE')),
        ('BOX', (4,0), (4,0), 1, colors.HexColor('#A7F3D0')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    charts_table = Table([[
        Image(pie_img, width=235, height=155),
        Image(bar_img, width=245, height=155)
    ]], colWidths=[240, 247])
    charts_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(charts_table)
    story.append(Spacer(1, 8))

    # ==================== 3. PONTOS FORTES E FRACOS ====================
    story.append(Paragraph("2. Diagnóstico de Postura: Pontos Fortes vs. Pontos Fracos", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_SLATE_LIGHT, spaceBefore=2, spaceAfter=8))

    strengths_weaknesses = [
        [
            Paragraph("<b>🛡️ PONTOS FORTES IDENTIFICADOS</b>", ParagraphStyle('SFort', fontName='Helvetica-Bold', fontSize=8.5, textColor=COLOR_FORTE)),
            Paragraph("<b>⚠️ PRINCIPAIS VETORES DE RISCO (PONTOS FRACOS)</b>", ParagraphStyle('SFrac', fontName='Helvetica-Bold', fontSize=8.5, textColor=COLOR_CRITICA))
        ],
        [
            Paragraph(
                "• <b>Zero-Persistence Garantida:</b> Nenhum dado sensível de varredura ou código é persistido em disco ou enviado à nuvem.<br/>"
                "• <b>Validação de Schema Zod Estrita:</b> Bloqueio de injeções de payloads JSON mal formatados no parsing.<br/>"
                "• <b>Isolamento de Origem Robusto:</b> Implementação de COOP, COEP, CORP e CSP sem <code>'unsafe-inline'</code> em scripts.<br/>"
                "• <b>Container Hardened:</b> Execução com usuário sem privilégios (UID 101) na porta 8080.",
                callout_style
            ),
            Paragraph(
                "• <b>Quebra de Contrato em Rotas <code>/.well-known/</code>:</b> Nginx entrega SPA HTML com <code>Content-Type: application/json</code>.<br/>"
                "• <b>Risco de OOM DoS no Dropzone:</b> Falta de validação prévia de <code>file.size</code> antes de <code>FileReader.readAsText()</code>.<br/>"
                "• <b>Falta de Rate Limiting no Nginx:</b> Ausência de zonas <code>limit_req</code> contra inundações DoS.<br/>"
                "• <b>Mutação de Estado WebMCP sem Consentimento:</b> Agentes de IA podem sobrescrever a análise do usuário silenciosamente.",
                callout_style
            )
        ]
    ]
    sw_table = Table(strengths_weaknesses, colWidths=[240, 247])
    sw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#ECFDF5')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#FEF2F2')),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor('#F0FDF4')),
        ('BACKGROUND', (1,1), (1,1), colors.HexColor('#FFF1F2')),
        ('BOX', (0,0), (0,1), 1, colors.HexColor('#A7F3D0')),
        ('BOX', (1,0), (1,1), 1, colors.HexColor('#FECACA')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(sw_table)

    story.append(PageBreak())

    # ==================== 4. MATRIZ DE PRIORIZAÇÃO E QUICK WINS ====================
    story.append(Paragraph("3. Matriz de Priorização e Oportunidades de Quick Wins", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_SLATE_LIGHT, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A tabela abaixo consolida todos os <b>10 achados de segurança e resiliência</b> mapeados no repositório, ordenados pelo índice de criticidade e relação impacto/esforço. Itens marcados como <b>QUICK WIN</b> representam correções de alto impacto com tempo de implementação &le; 30 minutos.",
        body_style
    ))
    story.append(Spacer(1, 4))

    matrix_headers = [
        [
            Paragraph("<b>ID</b>", table_header_style),
            Paragraph("<b>Arquivo / Ponto</b>", table_header_style),
            Paragraph("<b>Categoria</b>", table_header_style),
            Paragraph("<b>Severidade</b>", table_header_style),
            Paragraph("<b>Esforço</b>", table_header_style),
            Paragraph("<b>Quick Win?</b>", table_header_style)
        ]
    ]

    matrix_rows = [
        [
            Paragraph("<b>#1</b>", table_cell_bold),
            Paragraph("<code>nginx.conf:80-106</code>", table_cell_style),
            Paragraph("Contrato de API (Discovery)", table_cell_style),
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", table_cell_bold),
            Paragraph("Baixo (15 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>#2</b>", table_cell_bold),
            Paragraph("<code>FileDropzone.tsx:39</code>", table_cell_style),
            Paragraph("Resiliência (Client DoS / OOM)", table_cell_style),
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", table_cell_bold),
            Paragraph("Baixo (10 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>#3</b>", table_cell_bold),
            Paragraph("<code>nginx.conf:1-174</code>", table_cell_style),
            Paragraph("Resiliência (Rate Limit)", table_cell_style),
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", table_cell_bold),
            Paragraph("Médio (30 min)", table_cell_style),
            Paragraph("<font color='#64748B'>NÃO</font>", table_cell_style)
        ],
        [
            Paragraph("<b>#4</b>", table_cell_bold),
            Paragraph("<code>useSemgrepStore.ts:35</code>", table_cell_style),
            Paragraph("Resiliência (Timeouts)", table_cell_style),
            Paragraph("<font color='#D97706'><b>MÉDIA</b></font>", table_cell_bold),
            Paragraph("Baixo (15 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>#5</b>", table_cell_bold),
            Paragraph("<code>webMcp.ts:53</code>", table_cell_style),
            Paragraph("WebMCP (Integridade Estado)", table_cell_style),
            Paragraph("<font color='#D97706'><b>MÉDIA</b></font>", table_cell_bold),
            Paragraph("Médio (1 hr)", table_cell_style),
            Paragraph("<font color='#64748B'>NÃO</font>", table_cell_style)
        ],
        [
            Paragraph("<b>#6</b>", table_cell_bold),
            Paragraph("<code>nginx.conf:14-23</code>", table_cell_style),
            Paragraph("Headers HTTP (HSTS/Tokens)", table_cell_style),
            Paragraph("<font color='#D97706'><b>MÉDIA</b></font>", table_cell_bold),
            Paragraph("Baixo (10 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>#7</b>", table_cell_bold),
            Paragraph("<code>defectdojo.adapter.ts:40</code>", table_cell_style),
            Paragraph("Normalização de Contrato", table_cell_style),
            Paragraph("<font color='#2563EB'><b>BAIXA</b></font>", table_cell_bold),
            Paragraph("Baixo (10 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>#8</b>", table_cell_bold),
            Paragraph("<code>public/sw.js:75</code>", table_cell_style),
            Paragraph("Conformidade HTTP (SW)", table_cell_style),
            Paragraph("<font color='#2563EB'><b>BAIXA</b></font>", table_cell_bold),
            Paragraph("Baixo (5 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>#9</b>", table_cell_bold),
            Paragraph("<code>docker-compose.yml:1-18</code>", table_cell_style),
            Paragraph("Hardening de Container", table_cell_style),
            Paragraph("<font color='#2563EB'><b>BAIXA</b></font>", table_cell_bold),
            Paragraph("Baixo (10 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>#10</b>", table_cell_bold),
            Paragraph("<code>sanitizer.service.ts:5</code>", table_cell_style),
            Paragraph("Integridade de Snippets", table_cell_style),
            Paragraph("<font color='#2563EB'><b>BAIXA</b></font>", table_cell_bold),
            Paragraph("Baixo (15 min)", table_cell_style),
            Paragraph("<font color='#059669'><b>SIM</b></font>", table_cell_bold)
        ],
    ]

    matrix_table = Table(matrix_headers + matrix_rows, colWidths=[28, 122, 132, 65, 80, 60])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_DARK),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
    ]))
    story.append(matrix_table)

    story.append(PageBreak())

    # ==================== 5. DETALHAMENTO COMPLETO DOS ACHADOS ====================
    story.append(Paragraph("4. Detalhamento Técnico dos Achados por Categoria", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_SLATE_LIGHT, spaceBefore=2, spaceAfter=8))

    findings_data = [
        {
            "id": "#1",
            "title": "Retorno de HTML como application/json em Rotas /.well-known/ Inexistentes",
            "sev": "ALTA",
            "sev_color": "#EA580C",
            "effort": "BAIXO (15 min)",
            "quick_win": True,
            "file": "frontend/nginx.conf:80-106 e frontend/public/",
            "cat": "OWASP API8:2023 - Security Misconfiguration / API Contract Violation",
            "problem": "O Nginx possui blocos configurados para /.well-known/oauth-protected-resource e /.well-known/oauth-authorization-server com default_type application/json;, porém com fallback try_files ... /index.html;. Como os arquivos estáticos não existem em frontend/public/.well-known/, o servidor entrega o código HTML do SPA com cabeçalho Content-Type: application/json; charset=utf-8. Agentes de IA e clientes HTTP quebram com SyntaxError na desserialização de JSON. Além disso, endpoints anunciados no header Link (/.well-known/api-catalog, /.well-known/agent-skills/index.json, /.well-known/mcp/server-card.json) retornam 404.",
            "fix": "1. Criar os arquivos JSON físicos no diretório frontend/public/.well-known/ com seus respectivos schemas (RFC 9727 linkset+json, SEP-1649 MCP card, Agent Skills index).\n2. Remover o fallback /index.html das diretivas de API/JSON no nginx.conf, retornando 404 explícito caso o arquivo não exista."
        },
        {
            "id": "#2",
            "title": "Ausência de Validação de file.size no Dropzone Antes de Leitura (OOM Crash)",
            "sev": "ALTA",
            "sev_color": "#EA580C",
            "effort": "BAIXO (10 min)",
            "quick_win": True,
            "file": "frontend/src/components/common/FileDropzone.tsx:39-57",
            "cat": "OWASP API4:2023 - Unrestricted Resource Consumption (Client-Side DoS)",
            "problem": "A função readFile valida a extensão .json e o MIME type, mas não valida file.size antes de chamar reader.readAsText(file). O limite de 50MB é validado tardiamente dentro de loadJson() no Zustand. Se um usuário arrastar um arquivo de 1GB+, o FileReader tenta alocar o buffer completo na memória RAM do navegador, causando congelamento da UI e travamento por Out Of Memory (OOM).",
            "fix": "Inserir a verificação defensiva de tamanho logo no início de readFile(file: File):\nif (file.size > 50 * 1024 * 1024) {\n  alert('O arquivo selecionado excede o limite máximo de 50MB.');\n  return;\n}"
        },
        {
            "id": "#3",
            "title": "Ausência de Módulo de Rate Limiting (limit_req) e client_max_body_size no Nginx",
            "sev": "ALTA",
            "sev_color": "#EA580C",
            "effort": "MÉDIO (30 min)",
            "quick_win": False,
            "file": "frontend/nginx.conf:1-174",
            "cat": "OWASP API4:2023 - Unrestricted Resource Consumption (Rate Limiting)",
            "problem": "O Nginx de produção não define limites de taxa de requisições por IP (limit_req_zone / limit_req) nem restrição explícita de client_max_body_size. Endpoints que servem amostras estáticas pesadas (/samples/semgrep-sample-report.json) ou arquivos de descoberta podem ser alvos de flooding automatizado, consumindo descritores de rede e I/O da VPS.",
            "fix": "No nginx.conf, declarar na seção http/server:\nlimit_req_zone $binary_remote_addr zone=req_limit:10m rate=30r/s;\nclient_max_body_size 50M;\nE aplicar limit_req zone=req_limit burst=20 nodelay; nos blocos de location."
        },
        {
            "id": "#4",
            "title": "Requisição fetch() sem Timeout / AbortController no Carregamento de Exemplos",
            "sev": "MÉDIA",
            "sev_color": "#D97706",
            "effort": "BAIXO (15 min)",
            "quick_win": True,
            "file": "frontend/src/store/useSemgrepStore.ts:32-43",
            "cat": "Resiliência & Timeouts em Chamadas Downstream",
            "problem": "A função loadSample() executa fetch('/samples/semgrep-sample-report.json') sem AbortController ou AbortSignal.timeout(). Se a rede oscilar ou o gateway travar, o estado do Zustand permanece indefinidamente bloqueado em isLoading: true sem possibilidade de recuperação pelo usuário.",
            "fix": "Adicionar AbortSignal com timeout de 8 segundos:\nconst res = await fetch('/samples/semgrep-sample-report.json', {\n  signal: AbortSignal.timeout(8000)\n});"
        },
        {
            "id": "#5",
            "title": "Mutação Direta de Estado Global da Aplicação sem Confirmação do Usuário via WebMCP",
            "sev": "MÉDIA",
            "sev_color": "#D97706",
            "effort": "MÉDIO (1 hr)",
            "quick_win": False,
            "file": "frontend/src/utils/webMcp.ts:42-54",
            "cat": "OWASP API5:2023 - Broken Function Level Authorization / WebMCP Integrity",
            "problem": "A ferramenta analyze_semgrep_report exposta para agentes via navigator.modelContext.provideContext() executa useSemgrepStore.setState({ report ... }) diretamente. Scripts ou agentes externos podem sobrescrever a tela de análise do usuário ativo sem qualquer confirmação visual ou diálogo de consentimento.",
            "fix": "Separar a execução do WebMCP em duas modalidades: (a) Retorno puro de métricas estruturadas para o agente sem mutação de tela; (b) Emissão de evento customizado com notificação Toast para que o operador decida se deseja carregar o relatório no dashboard."
        },
        {
            "id": "#6",
            "title": "Ausência de Cabeçalho HSTS, Ocultação de Versão e Inconsistência no server_name",
            "sev": "MÉDIA",
            "sev_color": "#D97706",
            "effort": "BAIXO (10 min)",
            "quick_win": True,
            "file": "frontend/nginx.conf:2-23",
            "cat": "OWASP API8:2023 - Security Misconfiguration / HTTP Headers",
            "problem": "O Nginx não emite o cabeçalho Strict-Transport-Security (HSTS), não desabilita a versão via server_tokens off;, e inclui o token default_server dentro do parâmetro server_name na linha 3 (server_name semgrep.brunoizidorio.com.br default_server;), o que é sintaticamente incorreto.",
            "fix": "No nginx.conf:\n1. Alterar para: listen 8080 default_server; server_name semgrep.brunoizidorio.com.br _;\n2. Adicionar: server_tokens off;\n3. Adicionar: add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\" always;"
        },
        {
            "id": "#7",
            "title": "Tratamento Incorreto de Contrabarras Windows (\\) na Extração de Hotspots",
            "sev": "BAIXA",
            "sev_color": "#2563EB",
            "effort": "BAIXO (10 min)",
            "quick_win": True,
            "file": "frontend/src/services/defectdojo.adapter.ts:39-43",
            "cat": "Normalização de Contratos & Resiliência de Dados",
            "problem": "A função getParentDirectory executa split('/') estrito. Relatórios gerados em ambiente Windows (com caminhos como src\\controllers\\user.ts) não têm suas pastas extraídas corretamente, sendo todos agrupados sob a pasta 'Raiz do Projeto'.",
            "fix": "Normalizar o caminho antes da divisão:\nfunction getParentDirectory(filePath: string): string {\n  const normalized = filePath.replace(/\\\\/g, '/');\n  const parts = normalized.split('/');\n  if (parts.length <= 1) return 'Raiz do Projeto';\n  return parts.slice(0, Math.min(2, parts.length - 1)).join('/');\n}"
        },
        {
            "id": "#8",
            "title": "Código HTTP Não Padronizado (488) em Respostas de Falha Offline no Service Worker",
            "sev": "BAIXA",
            "sev_color": "#2563EB",
            "effort": "BAIXO (5 min)",
            "quick_win": True,
            "file": "frontend/public/sw.js:75-79",
            "cat": "OWASP API8:2023 - HTTP Standards Compliance",
            "problem": "O Service Worker retorna status: 488 quando requisições não cacheadas falham offline. O status 488 não existe no padrão IANA/RFC 9110, causando comportamento anômalo em clientes e ferramentas de telemetria.",
            "fix": "Substituir status 488 pelo código padronizado 503 (Service Unavailable) ou 504 (Gateway Timeout)."
        },
        {
            "id": "#9",
            "title": "Ausência de Limites de Recursos e Filesystem Read-Only no Docker Compose",
            "sev": "BAIXA",
            "sev_color": "#2563EB",
            "effort": "BAIXO (10 min)",
            "quick_win": True,
            "file": "docker-compose.yml:1-18",
            "cat": "Hardening de Infraestrutura & Container Security",
            "problem": "O compose de produção não restringe limites de memória/CPU para o container, permitindo que ataques de DoS saturem os recursos do nó hospedeiro, além de não utilizar read_only: true e no-new-privileges: true.",
            "fix": "Adicionar no docker-compose.yml:\nsecurity_opt:\n  - no-new-privileges:true\nread_only: true\ntmpfs:\n  - /tmp\n  - /var/run\n  - /var/cache/nginx\ndeploy:\n  resources:\n    limits:\n      cpus: '0.50'\n      memory: 256M"
        },
        {
            "id": "#10",
            "title": "Mutilação de Tags HTML/XML em Snippets de Código via DOMPurify Destrutivo",
            "sev": "BAIXA",
            "sev_color": "#2563EB",
            "effort": "BAIXO (15 min)",
            "quick_win": True,
            "file": "frontend/src/services/sanitizer.service.ts:5 & CodeViewerModal.tsx:181",
            "cat": "Data Integrity & UI Rendering Defense",
            "problem": "A função sanitizeText utiliza DOMPurify com ALLOWED_TAGS: []. Quando o usuário visualiza snippets de código que contêm tags HTML/XML legítimas (ex: <div>, <template>) ou tipos genéricos TypeScript (<T>), o DOMPurify remove as tags completamente, desfigurando o código inspecionado. O React já realiza escape seguro nativo ao renderizar strings.",
            "fix": "Permitir renderização fiel de strings no bloco de código utilizando o escape nativo do React JSX, reservando DOMPurify estrito para injeções em contextos HTML ricos."
        }
    ]

    for finding in findings_data:
        finding_box = [
            [
                Paragraph(f"<b>Achado {finding['id']}: {finding['title']}</b>", ParagraphStyle('FTitle', fontName='Helvetica-Bold', fontSize=9, textColor=COLOR_DARK)),
                Paragraph(f"<font color='{finding['sev_color']}'><b>SEVERIDADE: {finding['sev']}</b></font> | Esforço: {finding['effort']}", ParagraphStyle('FSev', fontName='Helvetica-Bold', fontSize=7.5, alignment=2))
            ],
            [
                Paragraph(f"<b>Arquivo/Linha:</b> <code>{finding['file']}</code><br/>"
                          f"<b>Categoria:</b> {finding['cat']}<br/>"
                          f"<b>Tag:</b> {'<font color=\"#059669\"><b>[QUICK WIN]</b></font>' if finding['quick_win'] else '[Planejado]'}<br/><br/>"
                          f"<b>Problema & Risco:</b> {finding['problem']}<br/><br/>"
                          f"<b>Correção Recomendada:</b><br/><code>{finding['fix'].replace(chr(10), '<br/>')}</code>",
                          ParagraphStyle('FBody', fontName='Helvetica', fontSize=7.5, leading=10, textColor=COLOR_SLATE_DARK))
            ]
        ]
        finding_table = Table(finding_box, colWidths=[310, 177])
        finding_table.setStyle(TableStyle([
            ('SPAN', (0,1), (1,1)),
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
            ('BACKGROUND', (0,1), (-1,1), COLOR_BG_LIGHT),
            ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(finding_table)
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # ==================== 6. RECOMENDAÇÕES PRIORIZADAS ====================
    story.append(Paragraph("5. Recomendações Priorizadas de Remediação (Roadmap)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_SLATE_LIGHT, spaceBefore=2, spaceAfter=8))

    rec_data = [
        [
            Paragraph("<b>Fase / Prioridade</b>", table_header_style),
            Paragraph("<b>Ações de Remediação</b>", table_header_style),
            Paragraph("<b>Achados Relacionados</b>", table_header_style),
            Paragraph("<b>Prazo Sugerido</b>", table_header_style)
        ],
        [
            Paragraph("<b>P1 - Imediata (Quick Wins Críticos)</b>", table_cell_bold),
            Paragraph("1. Criar arquivos estáticos em <code>frontend/public/.well-known/</code> para sanar a quebra de contrato de API.<br/>"
                      "2. Inserir validação de <code>file.size &lt;= 50MB</code> no <code>FileDropzone.tsx</code> para prevenir travamento OOM do navegador.", table_cell_style),
            Paragraph("Achados #1, #2", table_cell_style),
            Paragraph("<b>Sprint Atual (&lt; 24h)</b>", table_cell_style)
        ],
        [
            Paragraph("<b>P2 - Curto Prazo (Resiliência & Hardening)</b>", table_cell_bold),
            Paragraph("1. Configurar <code>limit_req</code> e <code>client_max_body_size</code> no Nginx.<br/>"
                      "2. Adicionar HSTS, <code>server_tokens off;</code> e ajustar <code>server_name</code>.<br/>"
                      "3. Configurar timeout com <code>AbortSignal.timeout(8000)</code> na store Zustand.", table_cell_style),
            Paragraph("Achados #3, #4, #6", table_cell_style),
            Paragraph("<b>Próxima Sprint (1 semana)</b>", table_cell_style)
        ],
        [
            Paragraph("<b>P3 - Médio Prazo (WebMCP & Integridade)</b>", table_cell_bold),
            Paragraph("1. Refatorar ferramenta WebMCP para exigir consentimento ou operar em modo headless sem mutação destrutiva da UI.<br/>"
                      "2. Aplicar restrições de CPU/RAM (cgroups) e <code>read_only: true</code> no Docker Compose.", table_cell_style),
            Paragraph("Achados #5, #9", table_cell_style),
            Paragraph("<b>Próximas 2 semanas</b>", table_cell_style)
        ],
        [
            Paragraph("<b>P4 - Melhoria Contínua</b>", table_cell_bold),
            Paragraph("1. Normalizar separadores de caminho Windows (<code>\\</code>) no adapter DefectDojo.<br/>"
                      "2. Corrigir código de status HTTP do Service Worker (<code>503</code> em vez de <code>488</code>).<br/>"
                      "3. Preservar tags HTML em snippets de código.", table_cell_style),
            Paragraph("Achados #7, #8, #10", table_cell_style),
            Paragraph("<b>Backlog Técnico</b>", table_cell_style)
        ],
    ]

    rec_table = Table(rec_data, colWidths=[110, 217, 85, 75])
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_DARK),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
    ]))
    story.append(rec_table)

    story.append(PageBreak())

    # ==================== 7. SEÇÃO ISSUES PARA O GITHUB ====================
    story.append(Paragraph("6. Issues Prontas para o GitHub (Templates Completos)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_SLATE_LIGHT, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Os blocos delimitados a seguir contêm o texto integral em Markdown formatado para abertura direta de Issues no GitHub. Cada item possui critérios de aceite verificáveis e orientações de implementação.",
        body_style
    ))
    story.append(Spacer(1, 4))

    issues_text = [
        """--- ISSUE 1 ---
## [API/Segurança] Correção de Retorno HTML em Rotas /.well-known/ e Criação de Catálogos de Descoberta (RFC 9727 / RFC 8414)

**Labels:** `api`, `security`, `high-priority`, `bug`

### Descrição do Problema
As rotas de descoberta e metadados OAuth configuradas no Nginx (`/.well-known/oauth-protected-resource` e `/.well-known/oauth-authorization-server`) retornam o código HTML do SPA (`index.html`) com cabeçalho `Content-Type: application/json; charset=utf-8` devido ao fallback `try_files` para `/index.html` e à ausência dos arquivos físicos em `frontend/public/.well-known/`. Agentes de IA e ferramentas automatizadas falham ao tentar decodificar a resposta JSON.

### Evidência
- `frontend/nginx.conf:80-106`: Diretiva `try_files /.well-known/oauth-protected-resource /index.html;` com `default_type application/json;`.
- `frontend/public/`: Diretório `.well-known/` não existe.

### Impacto
Quebra severa de contrato de API (Content-Type Mismatch) e impossibilidade de descoberta automatizada de capacidades por agentes compatíveis com RFC 9727 e RFC 8414.

### Sugestão de Correção
1. Criar o diretório `frontend/public/.well-known/` contendo:
   - `api-catalog` (`application/linkset+json`)
   - `oauth-authorization-server` (`application/json`)
   - `oauth-protected-resource` (`application/json`)
   - `mcp/server-card.json` (`application/json`)
   - `agent-skills/index.json` (`application/json`)
2. Ajustar `nginx.conf` para servir os arquivos estáticos diretamente e retornar 404 caso não existam, sem fallback para `index.html`.

### Critérios de Aceite
- [ ] `curl -H "Accept: application/json" https://semgrep.brunoizidorio.com.br/.well-known/oauth-authorization-server` retorna JSON válido.
- [ ] `curl -H "Accept: application/linkset+json" https://semgrep.brunoizidorio.com.br/.well-known/api-catalog` retorna 200 OK com linkset JSON.
- [ ] Teste automatizado em `tests/agentDiscovery.test.ts` validando o conteúdo de todos os endpoints `.well-known/`.
--- FIM ISSUE 1 ---""",

        """--- ISSUE 2 ---
## [API/Segurança] Validação Defensiva de file.size no Dropzone para Mitigar Client-Side DoS (OOM Crash)

**Labels:** `security`, `performance`, `high-priority`, `quick-win`

### Descrição do Problema
O componente `FileDropzone.tsx` valida a extensão `.json` e o MIME type, mas não verifica o tamanho do arquivo (`file.size`) antes de invocar `FileReader.readAsText()`. A restrição de 50MB é aplicada apenas dentro da store Zustand. Arquivos gigantes (>500MB) provocam estouro de memória e congelamento da aba antes da validação.

### Evidência
- `frontend/src/components/common/FileDropzone.tsx:39-57`: Chamada a `reader.readAsText(file)` sem verificação prévia de `file.size`.

### Impacto
Negação de serviço no cliente (Client-Side Denial of Service / Browser Crash) em caso de seleção acidental de arquivos massivos.

### Sugestão de Correção
Adicionar verificação no início de `readFile`:
```typescript
if (file.size > 50 * 1024 * 1024) {
  alert(t('jsonSizeErrorAlert') || 'O arquivo excede o limite máximo de 50MB.');
  return;
}
```

### Critérios de Aceite
- [ ] Arquivo de 100MB submetido via drag-and-drop é rejeitado imediatamente sem disparar leitura em memória.
- [ ] Teste unitário em `tests/FileDropzone.test.tsx` garantindo a rejeição de arquivos `> 50MB`.
--- FIM ISSUE 2 ---""",

        """--- ISSUE 3 ---
## [API/Performance] Implementação de Rate Limiting e client_max_body_size no Nginx

**Labels:** `api`, `performance`, `infrastructure`, `high-priority`

### Descrição do Problema
O arquivo de configuração do Nginx não possui controle de taxa de requisições (`limit_req_zone` / `limit_req`) nem definição de `client_max_body_size`, expondo os endpoints estáticos e relatórios de exemplo a ataques de força bruta e exaustão de descritores de rede.

### Evidência
- `frontend/nginx.conf:1-174`: Ausência de diretivas `limit_req_zone` e `client_max_body_size`.

### Impacto
Possibilidade de saturação de banda e consumo excessivo de CPU/RAM no servidor VPS por requisições concorrentes massivas.

### Sugestão de Correção
Adicionar no `nginx.conf`:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
client_max_body_size 50M;

# Nos blocos de location:
limit_req zone=api_limit burst=20 nodelay;
```

### Critérios de Aceite
- [ ] Disparo de mais de 50 requisições simultâneas em `/samples/semgrep-sample-report.json` resulta em HTTP 429 / 503 com `limit_req`.
- [ ] Configuração validada via `nginx -t` e testes em `tests/nginx.config.test.ts`.
--- FIM ISSUE 3 ---""",

        """--- ISSUE 4 ---
## [API/Performance] Configuração de Timeout com AbortController no useSemgrepStore

**Labels:** `api`, `performance`, `resilience`, `medium-priority`, `quick-win`

### Descrição do Problema
O método `loadSample` na store Zustand executa `fetch('/samples/semgrep-sample-report.json')` sem `AbortController` ou `AbortSignal.timeout()`. Conexões instáveis podem deixar a aplicação bloqueada permanentemente no estado `isLoading: true`.

### Evidência
- `frontend/src/store/useSemgrepStore.ts:35`: `const res = await fetch('/samples/semgrep-sample-report.json');` sem `signal`.

### Impacto
Degradação de usabilidade e falta de resiliência em chamadas HTTP downstream.

### Sugestão de Correção
```typescript
const res = await fetch('/samples/semgrep-sample-report.json', {
  signal: AbortSignal.timeout(8000)
});
```

### Critérios de Aceite
- [ ] Requisição cancelada automaticamente após 8 segundos em caso de timeout de rede.
- [ ] Teste unitário simulando erro de timeout e retorno do estado `isLoading: false`.
--- FIM ISSUE 4 ---""",

        """--- ISSUE 5 ---
## [API/Segurança] Adição de Cabeçalho HSTS, Ocultação de Versão e Correção do server_name no Nginx

**Labels:** `security`, `infrastructure`, `medium-priority`, `quick-win`

### Descrição do Problema
Ausência do cabeçalho `Strict-Transport-Security` (HSTS), ausência de `server_tokens off;` para ocultar o banner do Nginx, e uso de `default_server` no parâmetro `server_name`.

### Evidência
- `frontend/nginx.conf:2-3`: `server_name semgrep.brunoizidorio.com.br default_server;`
- `frontend/nginx.conf:14-23`: Ausência de HSTS e `server_tokens off;`.

### Impacto
Vulnerabilidade a ataques de SSL-strip e enumeração de versão do servidor web por atacantes.

### Sugestão de Correção
Ajustar `nginx.conf`:
```nginx
listen 8080 default_server;
server_name semgrep.brunoizidorio.com.br _;
server_tokens off;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### Critérios de Aceite
- [ ] Respostas HTTP incluem cabeçalho `Strict-Transport-Security`.
- [ ] Header `Server:` não expõe a versão do Nginx em páginas de erro.
--- FIM ISSUE 5 ---""",

        """--- ISSUE 6 ---
## [API/Segurança] Isolamento e Notificação de Consentimento para Mutações via WebMCP

**Labels:** `api`, `security`, `webmcp`, `medium-priority`

### Descrição do Problema
A ferramenta WebMCP `analyze_semgrep_report` executa `useSemgrepStore.setState()` diretamente, permitindo que agentes externos alterem a visualização ativa na tela do operador sem notificação ou diálogo de confirmação.

### Evidência
- `frontend/src/utils/webMcp.ts:53`: `useSemgrepStore.setState({ report, isLoading: false, error: null });`

### Impacto
Perda de integridade da sessão do usuário por automações de terceiros ou agentes descontrolados.

### Sugestão de Correção
Separar o retorno dos dados processados (para o agente consumidor) e emitir uma notificação Toast na interface para autorização do usuário antes de substituir a análise ativa.

### Critérios de Aceite
- [ ] Invocação WebMCP retorna as métricas para o agente sem mutação forçada da tela.
- [ ] Teste unitário em `tests/agentDiscovery.test.ts` validando o novo fluxo de consentimento.
--- FIM ISSUE 6 ---""",

        """--- ISSUE 7 ---
## [API/Qualidade] Normalização de Caminhos de Arquivo Windows no DefectDojo Adapter

**Labels:** `bug`, `contract`, `low-priority`, `quick-win`

### Descrição do Problema
A função `getParentDirectory` realiza `split('/')` estrito, falhando ao extrair a hierarquia de pastas em relatórios gerados no Windows com contrabarras (`\\`).

### Evidência
- `frontend/src/services/defectdojo.adapter.ts:39-43`: `const parts = filePath.split('/');`

### Impacto
Métricas de Top Hotspots distorcidas para usuários em ambiente Windows.

### Sugestão de Correção
```typescript
function getParentDirectory(filePath: string): string {
  const normalized = filePath.replace(/\\\\/g, '/');
  const parts = normalized.split('/');
  if (parts.length <= 1) return 'Raiz do Projeto';
  return parts.slice(0, Math.min(2, parts.length - 1)).join('/');
}
```

### Critérios de Aceite
- [ ] Caminho `src\\backend\\auth.ts` é agrupado sob `src/backend`.
- [ ] Teste unitário cobrindo caminhos com separadores Windows e POSIX.
--- FIM ISSUE 7 ---""",

        """--- ISSUE 8 ---
## [API/Infra] Hardening de Recursos e Sistema Somente-Leitura no Docker Compose

**Labels:** `security`, `docker`, `infrastructure`, `low-priority`, `quick-win`

### Descrição do Problema
O arquivo `docker-compose.yml` não especifica limites de recursos (`limits`), nem ativa `read_only: true` ou `no-new-privileges: true`.

### Evidência
- `docker-compose.yml:1-18`: Ausência de `deploy.resources.limits` e `security_opt`.

### Impacto
Risco de exaustão de recursos do host e falta de defesa em profundidade no contêiner.

### Sugestão de Correção
Adicionar restrições de cgroups e segurança no serviço `semgrep-visualizer` do compose.

### Critérios de Aceite
- [ ] Contêiner executa com sistema de arquivos somente-leitura (`read_only: true`).
- [ ] Limites de 256MB RAM e 0.5 CPU aplicados com sucesso.
--- FIM ISSUE 8 ---"""
    ]

    for issue_text in issues_text:
        issue_box = [
            [Paragraph(f"<font name='Courier' size=7 color='#0F172A'>{issue_text.replace(chr(10), '<br/>').replace(' ', '&nbsp;')}</font>", code_style)]
        ]
        issue_table = Table(issue_box, colWidths=[487])
        issue_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(issue_table)
        story.append(Spacer(1, 8))

    # Construir documento
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Relatório PDF gerado com sucesso em: {filename}")


if __name__ == '__main__':
    target_path = "docs/api-audit/relatorio-auditoria-api.pdf"
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
    build_pdf(target_path)
