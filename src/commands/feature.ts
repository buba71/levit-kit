import readline from "node:readline/promises";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { FeatureService } from "../services/feature_service";

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

  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    if (!title) {
      title = (await rl.question("Feature title: ")).trim();
    }

    if (!slug) {
      const computed = normalizeSlug(title || "");
      slug = (await rl.question(`Feature slug [${computed}]: `)).trim() || computed;
    }

    await rl.close();
  }

  if (!title) {
    throw new Error("Missing --title");
  }
  if (!slug) {
    throw new Error("Missing --slug");
  }

  FeatureService.createFeature(projectRoot, { title, slug, id, overwrite });
}
