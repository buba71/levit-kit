import { z } from "zod";

/**
 * Minimal schema for antigravity.yaml
 * This schema validates only the project foundation layer.
 * Advanced agent and feature configurations are intentionally excluded.
 */

export const AntigravitySchema = z.object({
  project: z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    repo: z.string().optional(),
    default_branch: z.string().optional()
  }),

  policies: z
    .object({
      human_approval_required: z.array(z.string()).optional(),
      safety: z
        .object({
          allow_file_deletion: z.boolean().optional(),
          allow_db_migration_without_backup: z.boolean().optional()
        })
        .optional()
    })
    .optional(),

  logging: z
    .object({
      level: z.enum(["silent", "normal", "verbose"]).optional(),
      artifacts: z.boolean().optional()
    })
    .optional()
}).passthrough();

export type AntigravityConfig = z.infer<typeof AntigravitySchema>;

