import path from "node:path";
import { writeTextFile } from "../core/write_file";
import { nextSequentialId } from "../core/ids";

export interface CreateDecisionOptions {
  title: string;
  featureRef?: string;
  id?: string;
  overwrite?: boolean;
}

function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-");
}

export class DecisionService {
  static createDecision(projectRoot: string, options: CreateDecisionOptions): void {
     const { title, featureRef, overwrite } = options;
     let { id } = options;

     const baseDir = path.join(projectRoot, ".levit", "decisions");
     
     // Auto-generate ID if missing
     if (!id) {
       id = nextSequentialId(baseDir, /^ADR-(\d+)-/);
     }

     const slug = normalizeSlug(title);
     const fileName = `ADR-${id}-${slug}.md`;
     const decisionPath = path.join(baseDir, fileName);

     const date = new Date().toISOString().split("T")[0];
     const frontmatter = `---
id: ADR-${id}
status: draft
owner: human
last_updated: ${date}
risk_level: low
depends_on: [${featureRef || ""}]
---

`;

     const featureLine = featureRef ? `- **Feature**: ${featureRef}\n` : "";

     const content = `${frontmatter}# ADR ${id}: ${title}\n\n- **Date**: ${date}\n- **Status**: [Draft / Proposed / Approved]\n${featureLine}\n## Context\n[fill]\n\n## Decision\n[fill]\n\n## Rationale\n[fill]\n\n## Alternatives Considered\n[fill]\n\n## Consequences\n[fill]\n`;

     writeTextFile(decisionPath, content, { overwrite: !!overwrite });

     process.stdout.write(`Created ${path.relative(projectRoot, decisionPath)}\n`);
  }
}
