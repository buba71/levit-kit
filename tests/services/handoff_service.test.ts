import test from "node:test";
import assert from "node:assert";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";

import { HandoffService } from "../../src/services/handoff_service";

test("HandoffService.createHandoff generates correct file name", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "handoff-service-test-"));
    const handoffDir = path.join(tempDir, ".levit", "handoff");
    fs.ensureDirSync(handoffDir);

    const date = new Date().toISOString().slice(0, 10);
    
    HandoffService.createHandoff(tempDir, {
        feature: "features/login.md",
        role: "qa"
    });

    // format: YYYY-MM-DD-filename-role.md
    const expectedFile = path.join(handoffDir, `${date}-login-qa.md`);
    assert.ok(fs.existsSync(expectedFile));

    const content = fs.readFileSync(expectedFile, "utf-8");
    assert.ok(content.includes(`id: HAND-${date}-qa`));
    assert.ok(content.includes("owner: qa"));

    fs.rmSync(tempDir, { recursive: true, force: true });
});
