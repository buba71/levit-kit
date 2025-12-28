#!/usr/bin/env node

import { initProject } from "../src/commands/init";
import { getVersion } from "../src/core/version";
import path from "node:path";

function showHelp() {
  console.log(`
Usage: levit [command] [options]

Commands:
  init <project-name>    Initialize a new levit project

Options:
  -v, --version          Show version number
  -h, --help             Show help
`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("-h") || args.includes("--help") || args.length === 0) {
    showHelp();
    process.exit(0);
  }

  if (args.includes("-v") || args.includes("--version")) {
    console.log(`levit-kit v${getVersion()}`);
    process.exit(0);
  }

  if (args[0] === "init") {
    const projectName = args[1];

    if (!projectName) {
      console.error("Error: Project name is required.");
      console.error("Usage: levit init <project-name>");
      process.exit(1);
    }

    // Basic validation: ensure it's a valid directory name
    if (!/^[a-z0-9-_]+$/i.test(projectName)) {
      console.error("Error: Invalid project name. Use only letters, numbers, dashes, and underscores.");
      process.exit(1);
    }

    const targetPath = path.resolve(process.cwd(), projectName);

    try {
      initProject(projectName, targetPath);
    } catch (error) {
      console.error(
        error instanceof Error ? `Error: ${error.message}` : "Unexpected error"
      );
      process.exit(1);
    }
  } else {
    console.error(`Error: Unknown command "${args[0]}"`);
    showHelp();
    process.exit(1);
  }
}

main();
