#!/usr/bin/env node

import { initProject } from "../src/init";
import path from "node:path";

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2 || args[0] !== "init") {
    console.error("Usage: levit init <project-name>");
    process.exit(1);
  }

  const projectName = args[1];
  const targetPath = path.resolve(process.cwd(), projectName);

  try {
    initProject(projectName, targetPath);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unexpected error"
    );
    process.exit(1);
  }
}

main();
