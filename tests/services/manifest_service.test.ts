import test from "node:test";
import assert from "node:assert";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";

import { ManifestService } from "../../src/services/manifest_service";

test("ManifestService.read returns default manifest when file doesn't exist", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  
  const manifest = ManifestService.read(tempDir);
  
  assert.strictEqual(manifest.project.name, "my-project");
  assert.strictEqual(manifest.version, "1.0.0");
  assert.deepStrictEqual(manifest.features, []);
  assert.deepStrictEqual(manifest.roles, []);
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.read reads existing manifest", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  const manifestPath = path.join(tempDir, "levit.json");
  
  const testManifest = {
    version: "1.0.0",
    project: {
      name: "test-project",
      description: "Test"
    },
    governance: {
      autonomy_level: "medium" as const,
      risk_tolerance: "medium" as const
    },
    features: [],
    roles: [],
    constraints: {},
    paths: {
      features: "features",
      decisions: ".levit/decisions",
      handoffs: ".levit/handoff"
    }
  };
  
  fs.writeJsonSync(manifestPath, testManifest, { spaces: 2 });
  
  const manifest = ManifestService.read(tempDir);
  
  assert.strictEqual(manifest.project.name, "test-project");
  assert.strictEqual(manifest.governance.autonomy_level, "medium");
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.write creates manifest file", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  const manifestPath = path.join(tempDir, "levit.json");
  
  const testManifest = {
    version: "1.0.0",
    project: {
      name: "write-test"
    },
    governance: {
      autonomy_level: "low" as const,
      risk_tolerance: "low" as const
    },
    features: [],
    roles: [],
    constraints: {},
    paths: {
      features: "features",
      decisions: ".levit/decisions",
      handoffs: ".levit/handoff"
    }
  };
  
  ManifestService.write(tempDir, testManifest);
  
  assert.ok(fs.existsSync(manifestPath));
  const written = fs.readJsonSync(manifestPath);
  assert.strictEqual(written.project.name, "write-test");
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.sync discovers features from filesystem", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  const featuresDir = path.join(tempDir, "features");
  fs.ensureDirSync(featuresDir);
  
  // Create a test feature file
  const featureContent = `---
id: 001
status: active
owner: human
last_updated: 2026-01-01
risk_level: low
depends_on: []
---

# INTENT: Test Feature
`;
  
  fs.writeFileSync(path.join(featuresDir, "001-test-feature.md"), featureContent);
  
  const manifest = ManifestService.sync(tempDir);
  
  assert.strictEqual(manifest.features.length, 1);
  assert.strictEqual(manifest.features[0].id, "001");
  assert.strictEqual(manifest.features[0].slug, "test-feature");
  assert.strictEqual(manifest.features[0].title, "Test Feature");
  assert.strictEqual(manifest.features[0].status, "active");
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.sync discovers roles from filesystem", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  const rolesDir = path.join(tempDir, "roles");
  fs.ensureDirSync(rolesDir);
  
  // Create a test role file
  const roleContent = `# Security Role
This is the security role description.
`;
  
  fs.writeFileSync(path.join(rolesDir, "security.md"), roleContent);
  
  const manifest = ManifestService.sync(tempDir);
  
  assert.strictEqual(manifest.roles.length, 1);
  assert.strictEqual(manifest.roles[0].name, "security");
  assert.strictEqual(manifest.roles[0].description, "Security Role");
  assert.strictEqual(manifest.roles[0].path, "roles/security.md");
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.sync ignores README files", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  const featuresDir = path.join(tempDir, "features");
  fs.ensureDirSync(featuresDir);
  
  // Create README and INTENT files (should be ignored)
  fs.writeFileSync(path.join(featuresDir, "README.md"), "# Features");
  fs.writeFileSync(path.join(featuresDir, "INTENT.md"), "# Intent Template");
  
  // Create actual feature
  const featureContent = `---
id: 001
status: active
owner: human
last_updated: 2026-01-01
risk_level: low
depends_on: []
---

# INTENT: Real Feature
`;
  fs.writeFileSync(path.join(featuresDir, "001-real-feature.md"), featureContent);
  
  const manifest = ManifestService.sync(tempDir);
  
  assert.strictEqual(manifest.features.length, 1);
  assert.strictEqual(manifest.features[0].slug, "real-feature");
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.sync handles missing directories gracefully", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  
  // No features or roles directories
  const manifest = ManifestService.sync(tempDir);
  
  assert.deepStrictEqual(manifest.features, []);
  assert.deepStrictEqual(manifest.roles, []);
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.sync handles features with invalid frontmatter gracefully", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  const featuresDir = path.join(tempDir, "features");
  fs.ensureDirSync(featuresDir);
  
  // Create feature with invalid frontmatter (missing closing ---)
  const invalidFeature = `---
id: 001
status: active
# Missing closing delimiter

# INTENT: Invalid Feature
`;
  
  fs.writeFileSync(path.join(featuresDir, "001-invalid.md"), invalidFeature);
  
  // Should not throw, but feature might have default values
  const manifest = ManifestService.sync(tempDir);
  
  // Should still discover the file (by filename)
  assert.strictEqual(manifest.features.length, 1);
  assert.strictEqual(manifest.features[0].id, "001");
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("ManifestService.sync extracts title from INTENT header", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-test-"));
  const featuresDir = path.join(tempDir, "features");
  fs.ensureDirSync(featuresDir);
  
  const featureContent = `---
id: 002
status: draft
owner: human
last_updated: 2026-01-01
risk_level: medium
depends_on: []
---

# INTENT: Complex Feature Title With Spaces
`;
  
  fs.writeFileSync(path.join(featuresDir, "002-complex.md"), featureContent);
  
  const manifest = ManifestService.sync(tempDir);
  
  assert.strictEqual(manifest.features[0].title, "Complex Feature Title With Spaces");
  
  fs.rmSync(tempDir, { recursive: true, force: true });
});

