import readline from "node:readline/promises";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { Logger } from "../core/logger";
import { HandoffService } from "../services/handoff_service";
import { LevitError, LevitErrorCode } from "../core/errors";

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

  const createdPath = HandoffService.createHandoff(projectRoot, { feature, role, overwrite });
  Logger.info(`Created ${createdPath}`);
}
