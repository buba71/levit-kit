import readline from "node:readline/promises";
import chalk from "chalk";
import path from "node:path";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { Logger } from "../core/logger";
import { HandoffService } from "../services/handoff_service";
import { LevitError, LevitErrorCode } from "../core/errors";
import { createBox } from "../core/table";

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function handoffCommand(argv: string[], cwd: string) {
  const { positional, flags } = parseArgs(argv);

  const sub = positional[0];
  if (sub !== "new") {
    throw new LevitError(
      LevitErrorCode.INVALID_COMMAND,
      "Usage: levit handoff new --feature <.levit/features/001-...md> [--role developer|qa|security|devops]"
    );
  }

  const projectRoot = requireLevitProjectRoot(cwd);

  const yes = getBooleanFlag(flags, "yes");
  const overwrite = getBooleanFlag(flags, "force");
  const isJsonMode = Logger.getJsonMode();

  let feature = getStringFlag(flags, "feature");
  let role = getStringFlag(flags, "role");

  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!feature) {
      feature = (await rl.question("Feature path (e.g. .levit/features/001-...md): ")).trim();
    }

    if (!role) {
      role = (await rl.question("Role [developer]: ")).trim() || "developer";
    }

    await rl.close();
  }

  if (!feature) {
    throw new LevitError(LevitErrorCode.MISSING_REQUIRED_ARG, "Missing --feature");
  }
  if (!role) {
    role = "developer";
  }

  // Preview before creation
  if (!yes && !isJsonMode) {
    const safeRole = role.trim().toLowerCase();
    const date = isoDate();
    const fileName = `${date}-${path.basename(feature, path.extname(feature))}-${safeRole}.md`;
    const handoffPath = path.relative(projectRoot, path.join(projectRoot, ".levit", "handoff", fileName));
    
    const preview = createBox("Handoff Preview", {
      "Date": date,
      "Feature": feature,
      "Role": safeRole,
      "Path": handoffPath
    });
    
    Logger.info("");
    Logger.info(preview);
    Logger.info("");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const confirm = await rl.question("Create this handoff? [y/N]: ");
    await rl.close();

    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      Logger.info("Cancelled.");
      return;
    }
  }

  const createdPath = HandoffService.createHandoff(projectRoot, { feature, role, overwrite });
  Logger.success(`Created ${createdPath}`);
}
