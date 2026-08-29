import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Progressive Web App (PWA) Assets & Config', () => {
  const publicDir = path.resolve(__dirname, '../public');

  it('should have a valid Web App Manifest (manifest.json)', () => {
    const manifestPath = path.join(publicDir, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifest.name).toBe('Semgrep CLI Visualizer & Executive Security Dashboard');
    expect(manifest.short_name).toBe('Semgrep Visualizer');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it('should have a valid Service Worker script (sw.js)', () => {
    const swPath = path.join(publicDir, 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);
    const content = fs.readFileSync(swPath, 'utf-8');

    expect(content).toContain('semgrep-visualizer-v2');
    expect(content).toContain("self.addEventListener('install'");
    expect(content).toContain("self.addEventListener('activate'");
    expect(content).toContain("self.addEventListener('fetch'");
  });

  it('should include PWA meta tags in index.html', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('<link rel="manifest" href="/manifest.json" />');
    expect(content).toContain('<meta name="mobile-web-app-capable" content="yes" />');
    expect(content).toContain('<meta name="apple-mobile-web-app-capable" content="yes" />');
  });
});
