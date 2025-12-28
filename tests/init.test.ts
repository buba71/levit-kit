import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

import { initProject } from "../src/commands/init";

function exists(p: string) {
  return fs.existsSync(p);
}

test("levit init copies default template exactly", () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "levit-kit-test-")
  );

  const projectName = "test-project";
  const projectPath = path.join(tempDir, projectName);

  initProject(projectName, projectPath);

  // Core structure assertions
  assert.ok(exists(projectPath), "Project directory should exist");
  assert.ok(exists(path.join(projectPath, "README.md")));
  assert.ok(exists(path.join(projectPath, "SOCIAL_CONTRACT.md")));
  assert.ok(exists(path.join(projectPath, "features")));
  assert.ok(exists(path.join(projectPath, "agents")));
  assert.ok(exists(path.join(projectPath, "roles")));
  assert.ok(exists(path.join(projectPath, "pipelines")));
  assert.ok(exists(path.join(projectPath, "docs")));
  assert.ok(exists(path.join(projectPath, "roles", "README.md")), "Roles README should exist");

  // New files assertions
  assert.ok(exists(path.join(projectPath, ".gitignore")), ".gitignore should exist");
  assert.ok(exists(path.join(projectPath, "package.json")), "package.json should exist");

  // Agent boundaries
  assert.ok(
    exists(path.join(projectPath, "agents", "AGENTS.md")),
    "Agent guidelines should exist"
  );

  // Feature contract
  assert.ok(
    exists(path.join(projectPath, "features", "README.md")),
    "Feature README should exist"
  );

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("CLI --help works", () => {
  const output = execSync("node dist/bin/cli.js --help").toString();
  assert.ok(output.includes("Usage: levit [command] [options]"));
  assert.ok(output.includes("init <project-name>"));
});

test("CLI --version works", () => {
  const output = execSync("node dist/bin/cli.js --version").toString();
  assert.ok(output.startsWith("levit-kit v"));
});

test("CLI name validation works", () => {
  try {
    execSync("node dist/bin/cli.js init invalid/name");
    assert.fail("Should have failed with invalid name");
  } catch (error: any) {
    assert.ok(error.stderr.toString().includes("Error: Invalid project name"));
  }
});
