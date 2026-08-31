import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Nginx Security Headers Configuration', () => {
  const nginxConfPath = path.resolve(__dirname, '../nginx.conf');
  const nginxConfig = fs.readFileSync(nginxConfPath, 'utf-8');

  it('should include Permissions-Policy header', () => {
    expect(nginxConfig).toContain('Permissions-Policy');
    expect(nginxConfig).toContain('camera=()');
    expect(nginxConfig).toContain('microphone=()');
  });

  it('should not contain unsafe-inline in script-src directive of Content-Security-Policy', () => {
    const cspMatch = nginxConfig.match(/Content-Security-Policy "[^"]+"/);
    expect(cspMatch).not.toBeNull();
    if (cspMatch) {
      const cspValue = cspMatch[0];
      // Extracts the script-src section of CSP
      const scriptSrcMatch = cspValue.match(/script-src [^;]+/);
      expect(scriptSrcMatch).not.toBeNull();
      if (scriptSrcMatch) {
        expect(scriptSrcMatch[0]).not.toContain("'unsafe-inline'");
      }
    }
  });

  it('should include Cross-Origin isolation headers (COEP, COOP, CORP)', () => {
    expect(nginxConfig).toContain('Cross-Origin-Embedder-Policy');
    expect(nginxConfig).toContain('Cross-Origin-Opener-Policy');
    expect(nginxConfig).toContain('Cross-Origin-Resource-Policy');
  });

  it('should retain headers in static asset caching location', () => {
    const staticLocationMatch = nginxConfig.match(/location ~\* \\\.\(\?:js\|css[^\}]+\}/s);
    expect(staticLocationMatch).not.toBeNull();
    if (staticLocationMatch) {
      const staticConfig = staticLocationMatch[0];
      expect(staticConfig).toContain('Permissions-Policy');
      expect(staticConfig).toContain('Cross-Origin-Embedder-Policy');
      expect(staticConfig).toContain('Cross-Origin-Opener-Policy');
      expect(staticConfig).toContain('Cross-Origin-Resource-Policy');
    }
  });

  it('should listen on unprivileged port 8080', () => {
    expect(nginxConfig).toMatch(/listen\s+8080\b/);
  });

  it('should include object-src \'none\' and base-uri \'self\' in Content-Security-Policy', () => {
    const cspMatches = nginxConfig.match(/Content-Security-Policy "[^"]+"/g);
    expect(cspMatches).not.toBeNull();
    expect(cspMatches!.length).toBeGreaterThan(0);
    for (const csp of cspMatches!) {
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
    }
  });

  it('should use unprivileged base image in Dockerfile', () => {
    const dockerfilePath = path.resolve(__dirname, '../Dockerfile');
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf-8');
    expect(dockerfileContent).toContain('FROM nginxinc/nginx-unprivileged:alpine-slim');
    expect(dockerfileContent).toContain('EXPOSE 8080');
    expect(dockerfileContent).toContain('USER 101');
  });

  it('should include Strict-Transport-Security (HSTS) header', () => {
    expect(nginxConfig).toContain('Strict-Transport-Security');
    expect(nginxConfig).toContain('max-age=31536000');
    expect(nginxConfig).toContain('includeSubDomains');
  });

  it('should include server_tokens off directive', () => {
    expect(nginxConfig).toMatch(/server_tokens\s+off;/);
  });

  it('should configure listen 8080 default_server correctly', () => {
    expect(nginxConfig).toMatch(/listen\s+8080\s+default_server;/);
  });

  it('should configure client_max_body_size to 50M', () => {
    expect(nginxConfig).toMatch(/client_max_body_size\s+50M;/);
  });

  it('should not fallback to /index.html in .well-known locations', () => {
    const wellKnownBlockMatch = nginxConfig.match(/location ~\* \^\\\/\\\.well-known\/[^\}]+\}/g);
    if (wellKnownBlockMatch) {
      for (const block of wellKnownBlockMatch) {
        expect(block).not.toContain('/index.html');
      }
    }
  });
});
