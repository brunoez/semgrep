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
    expect(nginxConfig).toMatch(/listen\s+8080;/);
  });

  it('should use unprivileged base image in Dockerfile', () => {
    const dockerfilePath = path.resolve(__dirname, '../Dockerfile');
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf-8');
    expect(dockerfileContent).toContain('FROM nginxinc/nginx-unprivileged:alpine-slim');
    expect(dockerfileContent).toContain('EXPOSE 8080');
    expect(dockerfileContent).toContain('USER 101');
  });
});
