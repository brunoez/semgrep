import { describe, it, expect } from 'vitest';
import { sanitizeText } from '../src/services/sanitizer.service';

describe('DOMPurify Sanitizer Service', () => {
  it('should strip malicious script tags from text inputs', () => {
    const dirty = '<script>alert("xss")</script>Hello World';
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('Hello World');
  });
});
