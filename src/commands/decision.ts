import readline from "node:readline/promises";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { Logger } from "../core/logger";
import { DecisionService } from "../services/decision_service";

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

  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!title) {
      title = (await rl.question("Decision title: ")).trim();
    }

    await rl.close();
  }

  if (!title) {
    throw new Error("Missing --title");
  }

  const createdPath = DecisionService.createDecision(projectRoot, { title, featureRef, id, overwrite });
  Logger.info(`Created ${createdPath}`);
}
