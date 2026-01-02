#!/usr/bin/env node

import { initProject } from "../src/commands/init";
import { decisionCommand } from "../src/commands/decision";
import { featureCommand } from "../src/commands/feature";
import { handoffCommand } from "../src/commands/handoff";
import { validateCommand } from "../src/commands/validate";
import { getVersion } from "../src/core/version";
import path from "node:path";

import { Logger } from "../src/core/logger";
import { LevitError, LevitErrorCode } from "../src/core/errors";

function showHelp() {
  Logger.info(`
Usage: levit [command] [options]

Commands:
  init <project-name>    Initialize a new levit project
  feature new            Create a new feature intent file (wizard)
  decision new           Create a new decision record (wizard)
  handoff new            Create an agent handoff brief (wizard)
  validate               Validate project cognitive scaffolding (cognitive linter)

Options:
  -v, --version          Show version number
  -h, --help             Show help
  --json                 Output in JSON format
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--json")) {
    Logger.setJsonMode(true);
  }

  if (args.includes("-h") || args.includes("--help") || args.length === 0) {
    showHelp();
    process.exit(0);
  }

  if (args.includes("-v") || args.includes("--version")) {
    console.log(`levit-kit v${getVersion()}`);
    process.exit(0);
  }

  const command = args[0];

  try {
    switch (command) {
      case "init":
        const projectName = args[1];
        if (!projectName) {
          throw new LevitError(
            LevitErrorCode.MISSING_REQUIRED_ARG,
            "Project name is required. Usage: levit init <project-name>"
          );
        }
        initProject(projectName, path.resolve(process.cwd(), projectName));
        break;

      case "feature":
        await featureCommand(args.slice(1), process.cwd());
        break;

      case "decision":
        await decisionCommand(args.slice(1), process.cwd());
        break;

      case "handoff":
        await handoffCommand(args.slice(1), process.cwd());
        break;

      case "validate":
        await validateCommand(args.slice(1), process.cwd());
        break;

      default:
        Logger.error(`Unknown command "${command}"`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    if (error instanceof LevitError) {
      Logger.error(`${error.message} (Code: ${error.code})`);
    } else {
      Logger.error(error instanceof Error ? error.message : "Unexpected error", error);
    }
    process.exit(1);
  }
}

void main();
