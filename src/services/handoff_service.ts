import path from "node:path";
import { writeTextFile } from "../core/write_file";
import { ManifestService } from "./manifest_service";
import { writeFileSafe } from "../core/security";
import { LevitError, LevitErrorCode } from "../core/errors";

export interface CreateHandoffOptions {
  feature: string;
  role: string;
  overwrite?: boolean;
}

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export class HandoffService {
  static createHandoff(projectRoot: string, options: CreateHandoffOptions): string {
      const { feature, role, overwrite } = options;
      const safeRole = role.trim().toLowerCase();
      const date = isoDate();

      // Sanitize feature basename to prevent path traversal
      const featureBasename = path.basename(feature, path.extname(feature));
      if (featureBasename.includes("..") || featureBasename.includes("/") || featureBasename.includes("\\")) {
        throw new LevitError(
          LevitErrorCode.VALIDATION_FAILED,
          `Invalid feature path: "${feature}" contains invalid characters`
        );
      }
      
      const fileName = `${date}-${featureBasename}-${safeRole}.md`;
      
      // Validate filename to prevent path traversal
      if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
        throw new LevitError(
          LevitErrorCode.VALIDATION_FAILED,
          `Invalid handoff filename: "${fileName}" contains invalid characters`
        );
      }
      
      const handoffPath = path.join(projectRoot, ".levit", "handoff", fileName);

      const frontmatter = `---
id: HAND-${date}-${safeRole}
status: active
owner: ${safeRole}
last_updated: ${date}
risk_level: low
depends_on: [${feature}]
---

`;

      const content = `${frontmatter}# Agent Handoff\n\n- **Date**: ${date}\n- **Role**: ${safeRole}\n- **Feature**: ${feature}\n\n## What to read first\n- SOCIAL_CONTRACT.md\n- .levit/AGENT_ONBOARDING.md\n- ${feature}\n\n## Boundaries\nFollow the Boundaries section of the feature spec strictly.\n\n## Deliverables\n- A minimal, atomic diff\n- A short summary: what changed + why\n- How to verify (commands to run)\n- Open questions / risks\n\n## Review protocol\nFollow: .levit/workflows/submit-for-review.md\n`;

      // Use secure file writing with path validation
      writeFileSafe(handoffPath, projectRoot, content, { overwrite: !!overwrite });
      
      // Auto-sync manifest after handoff creation
      ManifestService.sync(projectRoot);
      
      return path.relative(projectRoot, handoffPath);
  }
}
