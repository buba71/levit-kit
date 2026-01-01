import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

import { initProject } from "../../src/commands/init";

function exists(p: string) {
  return fs.existsSync(p);
}

function getCliPath() {
  return path.join(process.cwd(), "dist", "bin", "cli.js");
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

  // AIDD assertions
  assert.ok(exists(path.join(projectPath, ".levit")), ".levit directory should exist");
  assert.ok(exists(path.join(projectPath, ".levit", "AGENT_ONBOARDING.md")), "AGENT_ONBOARDING.md should exist");
  assert.ok(exists(path.join(projectPath, ".levit", "AGENT_CONTRACT.md")), "AGENT_CONTRACT.md should exist");
  assert.ok(exists(path.join(projectPath, ".levit", "workflows", "example-task.md")), "Example workflow should exist");
  assert.ok(exists(path.join(projectPath, ".levit", "workflows", "submit-for-review.md")), "Submit for review workflow should exist");
  assert.ok(exists(path.join(projectPath, ".levit", "prompts")), "Prompts directory should exist");
  assert.ok(exists(path.join(projectPath, ".levit", "prompts", "global-rules.md")), "Global rules should exist");

  // New folders assertions
  assert.ok(exists(path.join(projectPath, "evals")), "Evals directory should exist");
  assert.ok(exists(path.join(projectPath, "evals", "README.md")), "Evals README should exist");
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
  assert.ok(
    exists(path.join(projectPath, "features", "INTENT.md")),
    "Feature INTENT template should exist"
  );

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("CLI --help works", () => {
  const output = execSync("node dist/bin/cli.js --help").toString();
  assert.ok(output.includes("Usage: levit [command] [options]"));
  assert.ok(output.includes("init <project-name>"));
});

test("CLI feature new creates a feature intent file", () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "levit-kit-test-")
  );

  const projectName = "test-project";
  const projectPath = path.join(tempDir, projectName);
  initProject(projectName, projectPath);

  const cliPath = getCliPath();

  execSync(
    `node ${cliPath} feature new --yes --id 001 --title "My Feature" --slug my-feature`,
    { cwd: projectPath }
  );

  assert.ok(exists(path.join(projectPath, "features", "001-my-feature.md")));

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("CLI feature new auto-assigns id when omitted", () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "levit-kit-test-")
  );

  const projectName = "test-project";
  const projectPath = path.join(tempDir, projectName);
  initProject(projectName, projectPath);

  const cliPath = getCliPath();

  execSync(
    `node ${cliPath} feature new --yes --title "My Feature" --slug my-feature`,
    { cwd: projectPath }
  );

  assert.ok(exists(path.join(projectPath, "features", "001-my-feature.md")));

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("CLI decision new creates a decision record", () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "levit-kit-test-")
  );

  const projectName = "test-project";
  const projectPath = path.join(tempDir, projectName);
  initProject(projectName, projectPath);

  const cliPath = getCliPath();

  execSync(
    `node ${cliPath} decision new --yes --id 001 --title "Choose DB" --feature features/001-some-feature.md`,
    { cwd: projectPath }
  );

  assert.ok(exists(path.join(projectPath, ".levit", "decisions")));
  assert.ok(exists(path.join(projectPath, ".levit", "decisions", "ADR-001-choose-db.md")));

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("CLI decision new auto-assigns id when omitted", () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "levit-kit-test-")
  );

  const projectName = "test-project";
  const projectPath = path.join(tempDir, projectName);
  initProject(projectName, projectPath);

  const cliPath = getCliPath();

  execSync(
    `node ${cliPath} decision new --yes --title "Auto ID Decision"`,
    { cwd: projectPath }
  );

  assert.ok(exists(path.join(projectPath, ".levit", "decisions", "ADR-001-auto-id-decision.md")));

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("CLI handoff new creates an agent handoff brief", () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "levit-kit-test-")
  );

  const projectName = "test-project";
  const projectPath = path.join(tempDir, projectName);
  initProject(projectName, projectPath);

  const cliPath = getCliPath();

  execSync(
    `node ${cliPath} handoff new --yes --feature features/001-some-feature.md --role security`,
    { cwd: projectPath }
  );

  const handoffDir = path.join(projectPath, ".levit", "handoff");
  assert.ok(exists(handoffDir));
  assert.ok(fs.readdirSync(handoffDir).some((f) => f.endsWith("-security.md")));

  fs.rmSync(tempDir, { recursive: true, force: true });
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
