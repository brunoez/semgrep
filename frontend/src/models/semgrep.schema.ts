import { z } from 'zod';

export const SemgrepFindingSchema = z.object({
  check_id: z.string(),
  path: z.string(),
  start: z.object({ line: z.number(), col: z.number() }),
  end: z.object({ line: z.number(), col: z.number() }),
  extra: z.object({
    message: z.string(),
    lines: z.string().optional(),
    severity: z.string().optional(),
    metadata: z.object({
      category: z.string().optional(),
      cwe: z.union([z.string(), z.array(z.string()), z.boolean()]).optional(),
      owasp: z.union([z.string(), z.array(z.string())]).optional(),
      impact: z.string().optional(),
      confidence: z.string().optional(),
      likelihood: z.string().optional(),
      severity: z.string().optional(),
      technology: z.union([z.string(), z.array(z.string())]).optional(),
      vulnerability_class: z.union([z.string(), z.array(z.string())]).optional(),
    }).strip().optional(),
  }).strip(),
});

export const SemgrepReportSchema = z.object({
  version: z.string().optional(),
  results: z.array(SemgrepFindingSchema),
  errors: z.array(z.any()).optional(),
  paths: z.object({
    scanned: z.array(z.string()).optional(),
  }).optional(),
});

export type SemgrepReportInput = z.infer<typeof SemgrepReportSchema>;
