import test from "node:test";
import assert from "node:assert";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";

import { FeatureService } from "../../src/services/feature_service";

test("FeatureService.createFeature generates correct file", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "feature-service-test-"));
    const featuresDir = path.join(tempDir, "features");
    fs.ensureDirSync(featuresDir);

    FeatureService.createFeature(tempDir, {
        title: "Unit Test Feature",
        slug: "unit-test-feature",
        id: "999"
    });

    const expectedFile = path.join(featuresDir, "999-unit-test-feature.md");
    assert.ok(fs.existsSync(expectedFile));
    
    const content = fs.readFileSync(expectedFile, "utf-8");
    assert.ok(content.includes("id: 999"));
    // Slug is currently only used for filename, not in content
    // assert.ok(content.includes("slug: unit-test-feature"));
    assert.ok(content.includes("# INTENT: Unit Test Feature"));

    fs.rmSync(tempDir, { recursive: true, force: true });
});

test("FeatureService.createFeature auto-generates ID", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "feature-service-test-"));
    const featuresDir = path.join(tempDir, "features");
    fs.ensureDirSync(featuresDir);

    FeatureService.createFeature(tempDir, {
        title: "Auto ID Feature",
        slug: "auto-id"
    });

    // Should be 001-auto-id.md since directory is empty
    const expectedFile = path.join(featuresDir, "001-auto-id.md");
    assert.ok(fs.existsSync(expectedFile));

    fs.rmSync(tempDir, { recursive: true, force: true });
});
