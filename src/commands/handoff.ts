import path from "node:path";
import readline from "node:readline/promises";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { writeTextFile } from "../core/write_file";

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function handoffCommand(argv: string[], cwd: string) {
  const { positional, flags } = parseArgs(argv);

  const sub = positional[0];
  if (sub !== "new") {
    throw new Error("Usage: levit handoff new --feature <features/001-...md> [--role developer|qa|security|devops]");
  }

  const projectRoot = requireLevitProjectRoot(cwd);

  const yes = getBooleanFlag(flags, "yes");
  const overwrite = getBooleanFlag(flags, "force");

  let feature = getStringFlag(flags, "feature");
  let role = getStringFlag(flags, "role");

  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!feature) {
      feature = (await rl.question("Feature path (e.g. features/001-...md): ")).trim();
    }

    if (!role) {
      role = (await rl.question("Role [developer]: ")).trim() || "developer";
    }

    await rl.close();
  }

  if (!feature) {
    throw new Error("Missing --feature");
  }
  if (!role) {
    role = "developer";
  }

  const safeRole = role.trim().toLowerCase();
  const date = isoDate();

  const fileName = `${date}-${path.basename(feature, path.extname(feature))}-${safeRole}.md`;
  const handoffPath = path.join(projectRoot, ".levit", "handoff", fileName);

  const content = `# Agent Handoff\n\n- **Date**: ${date}\n- **Role**: ${safeRole}\n- **Feature**: ${feature}\n\n## What to read first\n- SOCIAL_CONTRACT.md\n- .levit/AGENT_ONBOARDING.md\n- ${feature}\n\n## Boundaries\nFollow the Boundaries section of the feature spec strictly.\n\n## Deliverables\n- A minimal, atomic diff\n- A short summary: what changed + why\n- How to verify (commands to run)\n- Open questions / risks\n\n## Review protocol\nFollow: .levit/workflows/submit-for-review.md\n`;

  writeTextFile(handoffPath, content, { overwrite });

  process.stdout.write(`Created ${path.relative(projectRoot, handoffPath)}\n`);
}
