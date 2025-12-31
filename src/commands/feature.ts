import fs from "fs-extra";
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

export async function featureCommand(argv: string[], cwd: string) {
  const { positional, flags } = parseArgs(argv);

  const sub = positional[0];
  if (sub !== "new") {
    throw new Error('Usage: levit feature new [--title "..."] [--slug "..."] [--id "001"]');
  }

  const projectRoot = requireLevitProjectRoot(cwd);

  const yes = getBooleanFlag(flags, "yes");
  const overwrite = getBooleanFlag(flags, "force");

  let title = getStringFlag(flags, "title");
  let slug = getStringFlag(flags, "slug");
  let id = getStringFlag(flags, "id");

  const computedId = nextSequentialId(path.join(projectRoot, "features"), /^(\d+)-/);

  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!title) {
      title = (await rl.question("Feature title: ")).trim();
    }

    if (!slug) {
      const computed = normalizeSlug(title || "");
      slug = (await rl.question(`Feature slug [${computed}]: `)).trim() || computed;
    }

    if (!id) {
      id = (await rl.question(`Feature id [${computedId}]: `)).trim() || computedId;
    }

    await rl.close();
  }

  if (!id) {
    id = computedId;
  }

  if (!title) {
    throw new Error("Missing --title");
  }
  if (!slug) {
    throw new Error("Missing --slug");
  }

  const fileName = `${id}-${slug}.md`;
  const featurePath = path.join(projectRoot, "features", fileName);

  const content = `# INTENT: ${title}\n\n## 1. Vision (The \"Why\")\n- **User Story**: [fill]\n- **Priority**: [Low / Medium / High / Critical]\n\n## 2. Success Criteria (The \"What\")\n- [ ] Criterion 1\n\n## 3. Boundaries (The \"No\")\n- Non-goal 1\n\n## 4. Technical Constraints\n- [fill]\n\n## 5. Agent Task\n- [fill]\n`;

  writeTextFile(featurePath, content, { overwrite });

  process.stdout.write(`Created ${path.relative(projectRoot, featurePath)}\n`);
}
