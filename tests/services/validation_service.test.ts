import test from "node:test";
import assert from "node:assert";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";

import { ValidationService } from "../../src/services/validation_service";

test("ValidationService reports errors if core directories are missing", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    
    // Validate empty dir
    const result = ValidationService.validate(tempDir);
    
    // Expect invalid
    assert.strictEqual(result.valid, false);
    assert.ok(result.metrics.errors > 0, "Should have errors");
    
    // Check specific error code presence
    const missingDirs = result.issues.filter(i => i.code === "MISSING_DIRECTORY");
    assert.ok(missingDirs.length > 0, "Should report missing directories");

    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ValidationService passes for valid structure", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-succ-"));
    
    // Scout scaffolding: features, .levit/decisions, .levit/handoff, core files
    const dirs = ["features", ".levit/decisions", ".levit/handoff"];
    dirs.forEach(d => fs.ensureDirSync(path.join(tempDir, d)));

    const files = ["SOCIAL_CONTRACT.md", ".levit/AGENT_CONTRACT.md", ".levit/AGENT_ONBOARDING.md"];
    files.forEach(f => fs.writeFileSync(path.join(tempDir, f), "content"));
    
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.valid, true);

    fs.rmSync(tempDir, { recursive: true, force: true });
});
