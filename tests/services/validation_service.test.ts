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
    
    // Scout scaffolding: .levit/features, .levit/decisions, .levit/handoff, core files
    const dirs = [".levit/features", ".levit/decisions", ".levit/handoff"];
    dirs.forEach(d => fs.ensureDirSync(path.join(tempDir, d)));

    const files = ["SOCIAL_CONTRACT.md", ".levit/AGENT_CONTRACT.md", ".levit/AGENT_ONBOARDING.md"];
    files.forEach(f => fs.writeFileSync(path.join(tempDir, f), "content"));
    
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.valid, true);

    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ValidationService detects feature with invalid frontmatter", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    const featuresDir = path.join(tempDir, ".levit", "features");
    fs.ensureDirSync(featuresDir);
    
    // Create core structure
    fs.ensureDirSync(path.join(tempDir, ".levit/decisions"));
    fs.ensureDirSync(path.join(tempDir, ".levit/handoff"));
    fs.writeFileSync(path.join(tempDir, "SOCIAL_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_ONBOARDING.md"), "content");
    
    // Create feature with missing required fields
    const invalidFeature = `---
id: 001
status: active
# Missing: owner, last_updated, risk_level, depends_on

# INTENT: Test Feature
`;
    fs.writeFileSync(path.join(featuresDir, "001-test.md"), invalidFeature);
    
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.valid, false);
    const frontmatterErrors = result.issues.filter(i => i.code === "INVALID_FRONTMATTER");
    assert.ok(frontmatterErrors.length > 0, "Should report invalid frontmatter");
    
    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ValidationService detects feature without INTENT header", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    const featuresDir = path.join(tempDir, ".levit", "features");
    fs.ensureDirSync(featuresDir);
    
    // Create core structure
    fs.ensureDirSync(path.join(tempDir, ".levit/decisions"));
    fs.ensureDirSync(path.join(tempDir, ".levit/handoff"));
    fs.writeFileSync(path.join(tempDir, "SOCIAL_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_ONBOARDING.md"), "content");
    
    // Create feature without INTENT header
    const featureWithoutIntent = `---
id: 001
status: active
owner: human
last_updated: 2026-01-01
risk_level: low
depends_on: []
---

# Some other header
`;
    fs.writeFileSync(path.join(featuresDir, "001-test.md"), featureWithoutIntent);
    
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.valid, false);
    const structureErrors = result.issues.filter(i => i.code === "INVALID_STRUCTURE");
    assert.ok(structureErrors.length > 0, "Should report missing INTENT header");
    
    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ValidationService detects decision with invalid frontmatter", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    const decisionsDir = path.join(tempDir, ".levit/decisions");
    fs.ensureDirSync(decisionsDir);
    
    // Create core structure
    fs.ensureDirSync(path.join(tempDir, ".levit", "features"));
    fs.ensureDirSync(path.join(tempDir, ".levit", "handoff"));
    fs.writeFileSync(path.join(tempDir, "SOCIAL_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_ONBOARDING.md"), "content");
    
    // Create decision with invalid YAML
    const invalidDecision = `---
id: ADR-001
status: draft
owner: human
last_updated: 2026-01-01
risk_level: low
depends_on: [invalid: yaml: syntax]
---

# ADR 001: Test
`;
    fs.writeFileSync(path.join(decisionsDir, "ADR-001-test.md"), invalidDecision);
    
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.valid, false);
    const frontmatterErrors = result.issues.filter(i => i.code === "INVALID_FRONTMATTER");
    assert.ok(frontmatterErrors.length > 0, "Should report invalid YAML");
    
    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ValidationService detects handoff with missing frontmatter", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    const handoffDir = path.join(tempDir, ".levit/handoff");
    fs.ensureDirSync(handoffDir);
    
    // Create core structure
    fs.ensureDirSync(path.join(tempDir, ".levit", "features"));
    fs.ensureDirSync(path.join(tempDir, ".levit", "decisions"));
    fs.writeFileSync(path.join(tempDir, "SOCIAL_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_ONBOARDING.md"), "content");
    
    // Create handoff without frontmatter
    const handoffWithoutFrontmatter = `# Agent Handoff
No frontmatter here
`;
    fs.writeFileSync(path.join(handoffDir, "2026-01-01-test.md"), handoffWithoutFrontmatter);
    
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.valid, false);
    const frontmatterErrors = result.issues.filter(i => i.code === "INVALID_FRONTMATTER");
    assert.ok(frontmatterErrors.length > 0, "Should report missing frontmatter");
    
    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ValidationService reports warning when no features exist", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    const featuresDir = path.join(tempDir, ".levit", "features");
    fs.ensureDirSync(featuresDir);
    
    // Create core structure
    fs.ensureDirSync(path.join(tempDir, ".levit/decisions"));
    fs.ensureDirSync(path.join(tempDir, ".levit/handoff"));
    fs.writeFileSync(path.join(tempDir, "SOCIAL_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_ONBOARDING.md"), "content");
    
    // No features in features directory
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.valid, true, "Should be valid (only warning)");
    assert.ok(result.metrics.warnings > 0, "Should have warnings");
    const noFeaturesWarning = result.issues.find(i => i.code === "NO_FEATURES");
    assert.ok(noFeaturesWarning, "Should report no features warning");
    
    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ValidationService counts files scanned correctly", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    const featuresDir = path.join(tempDir, ".levit", "features");
    fs.ensureDirSync(featuresDir);
    
    // Create core structure
    fs.ensureDirSync(path.join(tempDir, ".levit/decisions"));
    fs.ensureDirSync(path.join(tempDir, ".levit/handoff"));
    fs.writeFileSync(path.join(tempDir, "SOCIAL_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_CONTRACT.md"), "content");
    fs.writeFileSync(path.join(tempDir, ".levit/AGENT_ONBOARDING.md"), "content");
    
    // Create valid feature
    const validFeature = `---
id: 001
status: active
owner: human
last_updated: 2026-01-01
risk_level: low
depends_on: []
---

# INTENT: Test Feature
`;
    fs.writeFileSync(path.join(featuresDir, "001-test.md"), validFeature);
    
    // Create valid decision
    const validDecision = `---
id: ADR-001
status: draft
owner: human
last_updated: 2026-01-01
risk_level: low
depends_on: []
---

# ADR 001: Test Decision
`;
    fs.writeFileSync(path.join(tempDir, ".levit/decisions", "ADR-001-test.md"), validDecision);
    
    const result = ValidationService.validate(tempDir);
    
    assert.strictEqual(result.metrics.filesScanned, 2, "Should scan 2 files (1 feature + 1 decision)");
    
    fs.rmSync(tempDir, { recursive: true, force: true });
});
