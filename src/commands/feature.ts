import readline from "node:readline/promises";
import chalk from "chalk";
import path from "node:path";

import { requireLevitProjectRoot } from "../core/levit_project";
import { getBooleanFlag, getStringFlag, parseArgs } from "../core/cli_args";
import { Logger } from "../core/logger";
import { FeatureService } from "../services/feature_service";
import { LevitError, LevitErrorCode } from "../core/errors";
import { createTable, renderTable, createBox } from "../core/table";
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
  const projectRoot = requireLevitProjectRoot(cwd);

  switch (sub) {
    case "new":
      await handleFeatureNew(projectRoot, flags);
      break;

    case "list":
      handleFeatureList(projectRoot, flags);
      break;

    case "status":
      await handleFeatureStatus(projectRoot, positional.slice(1), flags);
      break;

    default:
      throw new LevitError(
        LevitErrorCode.INVALID_COMMAND,
        'Usage: levit feature <new|list|status> [options]\n' +
        '  new: Create a new feature\n' +
        '  list: List all features\n' +
        '  status: Update feature status (usage: levit feature status <id> <status>)'
      );
  }
}

async function handleFeatureNew(projectRoot: string, flags: Record<string, string | boolean>) {
  const yes = getBooleanFlag(flags, "yes");
  const overwrite = getBooleanFlag(flags, "force");
  const isJsonMode = Logger.getJsonMode();

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
    throw new LevitError(LevitErrorCode.MISSING_REQUIRED_ARG, "Missing --title");
  }
  if (!slug) {
    throw new LevitError(LevitErrorCode.MISSING_REQUIRED_ARG, "Missing --slug");
  }

  // Generate ID if not provided
  if (!id) {
    const baseDir = path.join(projectRoot, ".levit", "features");
    id = nextSequentialId(baseDir, /^(\d+)-/);
  }

  // Preview before creation
  if (!yes && !isJsonMode) {
    const featurePath = path.relative(projectRoot, path.join(projectRoot, ".levit", "features", `${id}-${slug}.md`));
    const preview = createBox("Feature Preview", {
      "ID": id,
      "Title": title,
      "Slug": slug,
      "Path": featurePath
    });
    
    Logger.info("");
    Logger.info(preview);
    Logger.info("");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const confirm = await rl.question("Create this feature? [y/N]: ");
    await rl.close();

    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      Logger.info("Cancelled.");
      return;
    }
  }

  const createdPath = FeatureService.createFeature(projectRoot, { title, slug, id, overwrite });
  Logger.success(`Created ${createdPath}`);
}

function handleFeatureList(projectRoot: string, flags: Record<string, string | boolean>) {
  const features = FeatureService.listFeatures(projectRoot);
  const isJsonMode = Logger.getJsonMode();

  if (features.length === 0) {
    Logger.info("No features found.");
    return;
  }

  // Create formatted table
  const table = createTable(["ID", "Status", "Title"]);
  
  for (const feature of features) {
    // Color status based on value
    let statusDisplay: string = feature.status;
    switch (feature.status) {
      case "active":
        statusDisplay = isJsonMode ? "active" : chalk.green("● active");
        break;
      case "draft":
        statusDisplay = isJsonMode ? "draft" : chalk.yellow("○ draft");
        break;
      case "deprecated":
        statusDisplay = isJsonMode ? "deprecated" : chalk.red("× deprecated");
        break;
      case "completed":
        statusDisplay = isJsonMode ? "completed" : chalk.cyan("✓ completed");
        break;
    }
    
    (table as any).push([
      feature.id,
      statusDisplay,
      feature.title
    ]);
  }
  
  if (!isJsonMode) {
    Logger.info("");
    Logger.info(chalk.bold("Features:"));
  }
  
  renderTable(table, isJsonMode);
  
  if (!isJsonMode) {
    Logger.info(`\nTotal: ${chalk.bold(features.length.toString())} feature(s)`);
    Logger.info("");
  } else {
    Logger.info(JSON.stringify({ total: features.length }));
  }
}

async function handleFeatureStatus(
  projectRoot: string,
  args: string[],
  flags: Record<string, string | boolean>
) {
  const featureId = args[0] || getStringFlag(flags, "id");
  let newStatus = args[1] || getStringFlag(flags, "status");

  if (!featureId) {
    throw new LevitError(LevitErrorCode.MISSING_REQUIRED_ARG, "Missing feature ID. Usage: levit feature status <id> <status>");
  }

  const validStatuses: Array<'active' | 'draft' | 'deprecated' | 'completed'> = 
    ['active', 'draft', 'deprecated', 'completed'];

  if (!newStatus) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    newStatus = (await rl.question(`New status [active|draft|deprecated|completed]: `)).trim();
    await rl.close();
  }

  if (!validStatuses.includes(newStatus as any)) {
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED,
      `Invalid status "${newStatus}". Must be one of: ${validStatuses.join(", ")}`
    );
  }

  FeatureService.updateFeatureStatus(projectRoot, featureId, newStatus as any);
  Logger.info(`Updated feature ${featureId} status to "${newStatus}"`);
}
