import path from "node:path";
import readline from "node:readline/promises";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { writeTextFile } from "../core/write_file";
import { nextSequentialId } from "../core/ids";

function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-");
}

export async function decisionCommand(argv: string[], cwd: string) {
  const { positional, flags } = parseArgs(argv);

  const sub = positional[0];
  if (sub !== "new") {
    throw new Error('Usage: levit decision new [--title "..."] [--id "001"]');
  }

  const projectRoot = requireLevitProjectRoot(cwd);

  const yes = getBooleanFlag(flags, "yes");
  const overwrite = getBooleanFlag(flags, "force");

  let title = getStringFlag(flags, "title");
  let id = getStringFlag(flags, "id");
  const featureRef = getStringFlag(flags, "feature");

  const computedId = nextSequentialId(path.join(projectRoot, ".levit", "decisions"), /^ADR-(\d+)-/);

  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!title) {
      title = (await rl.question("Decision title: ")).trim();
    }

    if (!id) {
      id = (await rl.question(`Decision id [${computedId}]: `)).trim() || computedId;
    }

    await rl.close();
  }

  if (!id) {
    id = computedId;
  }

  if (!title) {
    throw new Error("Missing --title");
  }
  if (!id) {
    throw new Error("Missing --id");
  }

  const slug = normalizeSlug(title);
  const fileName = `ADR-${id}-${slug}.md`;
  const decisionPath = path.join(projectRoot, ".levit", "decisions", fileName);

  const featureLine = featureRef ? `- **Feature**: ${featureRef}\n` : "";

  const content = `# ADR ${id}: ${title}\n\n- **Date**: [YYYY-MM-DD]\n- **Status**: [Draft / Proposed / Approved]\n${featureLine}\n## Context\n[fill]\n\n## Decision\n[fill]\n\n## Rationale\n[fill]\n\n## Alternatives Considered\n[fill]\n\n## Consequences\n[fill]\n`;

  writeTextFile(decisionPath, content, { overwrite });

  process.stdout.write(`Created ${path.relative(projectRoot, decisionPath)}\n`);
}
