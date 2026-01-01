import path from "node:path";
import { writeTextFile } from "../core/write_file";

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

      const fileName = `${date}-${path.basename(feature, path.extname(feature))}-${safeRole}.md`;
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

      writeTextFile(handoffPath, content, { overwrite: !!overwrite });
      
      return path.relative(projectRoot, handoffPath);
  }
}
