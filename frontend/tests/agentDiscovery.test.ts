import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { registerWebMcpTools } from '../src/utils/webMcp';

describe('Agent Discovery & Agent-Ready Standard Files', () => {
  const publicDir = path.resolve(__dirname, '../public');

  it('should have valid robots.txt referencing sitemap.xml', () => {
    const robotsPath = path.join(publicDir, 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);
    const content = fs.readFileSync(robotsPath, 'utf-8');
    expect(content).toContain('Sitemap: https://semgrep.brunoizidorio.com.br/sitemap.xml');
  });

  it('should have valid sitemap.xml listing canonical URL', () => {
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    expect(content).toContain('<loc>https://semgrep.brunoizidorio.com.br/</loc>');
  });

  it('should have valid auth.md agent registration specification', () => {
    const authPath = path.join(publicDir, 'auth.md');
    expect(fs.existsSync(authPath)).toBe(true);
    const content = fs.readFileSync(authPath, 'utf-8');
    expect(content).toContain('# Auth.md - AI Agent Registration & Authentication Policy');
  });

  it('should have valid index.md markdown response', () => {
    const indexPath = path.join(publicDir, 'index.md');
    expect(fs.existsSync(indexPath)).toBe(true);
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('# 🛡️ Semgrep CLI Visualizer & Executive Security Dashboard');
  });

  it('should have valid llms.txt index', () => {
    const llmsPath = path.join(publicDir, 'llms.txt');
    expect(fs.existsSync(llmsPath)).toBe(true);
    const content = fs.readFileSync(llmsPath, 'utf-8');
    expect(content).toContain('https://semgrep.brunoizidorio.com.br/');
  });

  it('should have valid .well-known/api-catalog (RFC 9727)', () => {
    const apiCatalogPath = path.join(publicDir, '.well-known/api-catalog');
    expect(fs.existsSync(apiCatalogPath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(apiCatalogPath, 'utf-8'));
    expect(json.linkset).toBeDefined();
    expect(json.linkset[0].anchor).toBe('https://semgrep.brunoizidorio.com.br/');
  });

  it('should have valid .well-known/agent-skills/index.json (RFC v0.2.0)', () => {
    const skillsPath = path.join(publicDir, '.well-known/agent-skills/index.json');
    expect(fs.existsSync(skillsPath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));
    expect(json.$schema).toContain('agentskills.io');
    expect(json.skills[0].name).toBe('semgrep-sast-analysis');
  });

  it('should have valid .well-known/mcp/server-card.json (SEP-1649)', () => {
    const mcpPath = path.join(publicDir, '.well-known/mcp/server-card.json');
    expect(fs.existsSync(mcpPath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
    expect(json.serverInfo.name).toBe('Semgrep CLI Visualizer');
    expect(json.transport.type).toBe('webmcp');
  });

  it('should register WebMCP tools without errors', () => {
    let capturedTools: any = null;
    (global as any).navigator = {
      modelContext: {
        provideContext: (ctx: any) => {
          capturedTools = ctx.tools;
        }
      }
    };

    registerWebMcpTools();

    expect(capturedTools).not.toBeNull();
    expect(capturedTools.length).toBe(2);
    expect(capturedTools[0].name).toBe('analyze_semgrep_report');
    expect(capturedTools[1].name).toBe('get_executive_risk_score');
  });

  it('WebMCP: analyze_semgrep_report should reject payloads exceeding 50MB safely', async () => {
    let capturedTools: any = null;
    (global as any).navigator = {
      modelContext: {
        provideContext: (ctx: any) => {
          capturedTools = ctx.tools;
        }
      }
    };

    registerWebMcpTools();
    const analyzeTool = capturedTools.find((t: any) => t.name === 'analyze_semgrep_report');
    expect(analyzeTool).toBeDefined();

    // Payload de 51MB
    const oversizedPayload = 'a'.repeat(51 * 1024 * 1024);
    const result = await analyzeTool.execute({ reportContent: oversizedPayload });

    expect(result).toEqual({
      success: false,
      error: 'O payload do relatório excede o limite de segurança de 50MB.'
    });
  });

  it('WebMCP: analyze_semgrep_report should catch and return structured error for invalid JSON', async () => {
    let capturedTools: any = null;
    (global as any).navigator = {
      modelContext: {
        provideContext: (ctx: any) => {
          capturedTools = ctx.tools;
        }
      }
    };

    registerWebMcpTools();
    const analyzeTool = capturedTools.find((t: any) => t.name === 'analyze_semgrep_report');
    const result = await analyzeTool.execute({ reportContent: 'not valid json' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Formato de JSON inválido');
  });
});

