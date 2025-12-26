import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { initProject } from "../src/init";

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
});
