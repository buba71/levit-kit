import test from "node:test";
import assert from "node:assert";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";

import { DecisionService } from "../../src/services/decision_service";

test("DecisionService.createDecision generates correct structure", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "decision-service-test-"));
    const decisionsDir = path.join(tempDir, ".levit", "decisions");
    fs.ensureDirSync(decisionsDir);

    DecisionService.createDecision(tempDir, {
        title: "Test Architecture",
        id: "005",
        featureRef: ".levit/features/001.md"
    });

    const expectedFile = path.join(decisionsDir, "ADR-005-test-architecture.md");
    assert.ok(fs.existsSync(expectedFile));

    const content = fs.readFileSync(expectedFile, "utf-8");
    assert.ok(content.includes("id: ADR-005"));
    assert.ok(content.includes("depends_on: [.levit/features/001.md]"));

    fs.rmSync(tempDir, { recursive: true, force: true });
});
