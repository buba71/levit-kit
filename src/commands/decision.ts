import readline from "node:readline/promises";
import chalk from "chalk";
import path from "node:path";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { Logger } from "../core/logger";
import { DecisionService } from "../services/decision_service";
import { LevitError, LevitErrorCode } from "../core/errors";
import { createBox } from "../core/table";
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
    throw new LevitError(
      LevitErrorCode.INVALID_COMMAND,
      'Usage: levit decision new [--title "..."] [--id "001"]'
    );
  }

  const projectRoot = requireLevitProjectRoot(cwd);

  const yes = getBooleanFlag(flags, "yes");
  const overwrite = getBooleanFlag(flags, "force");
  const isJsonMode = Logger.getJsonMode();

  let title = getStringFlag(flags, "title");
  let id = getStringFlag(flags, "id");
  const featureRef = getStringFlag(flags, "feature");

  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!title) {
      title = (await rl.question("Decision title: ")).trim();
    }

    await rl.close();
  }

  if (!title) {
    throw new LevitError(LevitErrorCode.MISSING_REQUIRED_ARG, "Missing --title");
  }

  // Generate ID if not provided
  if (!id) {
    const baseDir = path.join(projectRoot, ".levit", "decisions");
    id = nextSequentialId(baseDir, /^ADR-(\d+)-/);
  }

  // Preview before creation
  if (!yes && !isJsonMode) {
    const slug = normalizeSlug(title);
    const decisionPath = path.relative(projectRoot, path.join(projectRoot, ".levit", "decisions", `ADR-${id}-${slug}.md`));
    const preview = createBox("Decision Preview", {
      "ID": `ADR-${id}`,
      "Title": title,
      "Feature": featureRef || "(none)",
      "Path": decisionPath
    });
    
    Logger.info("");
    Logger.info(preview);
    Logger.info("");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const confirm = await rl.question("Create this decision? [y/N]: ");
    await rl.close();

    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      Logger.info("Cancelled.");
      return;
    }
  }

  const createdPath = DecisionService.createDecision(projectRoot, { title, featureRef, id, overwrite });
  Logger.success(`Created ${createdPath}`);
}
