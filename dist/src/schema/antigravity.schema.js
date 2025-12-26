"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntigravitySchema = void 0;
const zod_1 = require("zod");
/**
 * Minimal schema for antigravity.yaml
 * This schema validates only the project foundation layer.
 * Advanced agent and feature configurations are intentionally excluded.
 */
exports.AntigravitySchema = zod_1.z.object({
    project: zod_1.z.object({
        name: zod_1.z.string().min(1, "Project name is required"),
        description: zod_1.z.string().optional(),
        repo: zod_1.z.string().optional(),
        default_branch: zod_1.z.string().optional()
    }),
    policies: zod_1.z
        .object({
        human_approval_required: zod_1.z.array(zod_1.z.string()).optional(),
        safety: zod_1.z
            .object({
            allow_file_deletion: zod_1.z.boolean().optional(),
            allow_db_migration_without_backup: zod_1.z.boolean().optional()
        })
            .optional()
    })
        .optional(),
    logging: zod_1.z
        .object({
        level: zod_1.z.enum(["silent", "normal", "verbose"]).optional(),
        artifacts: zod_1.z.boolean().optional()
    })
        .optional()
}).passthrough();
