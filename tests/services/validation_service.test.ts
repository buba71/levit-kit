import test from "node:test";
import assert from "node:assert";
import fs from "fs-extra";
import path from "node:path";
import os from "node:os";

import { ValidationService } from "../../src/services/validation_service";

test("ValidationService fails if core directories are missing", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-test-"));
    // Create empty dir
    
    // Capture stdout/stderr
    // Note: Intercepting console logs in tests is tricky with node:test without a library,
    // so we'll just check if process.exit was called or mocked.
    // Ideally, ValidationService should throw or return a result instead of exiting directly.
    // For this refactor, we will monkey-patch process.exit just for this test.
    
    let exitCode: number | undefined;
    const originalExit = process.exit;
    process.exit = ((code?: number) => {
        exitCode = code ?? 0;
        return undefined as never;
    }) as any;

    const originalError = console.error;
    console.error = () => {}; // Silence error output

    try {
        ValidationService.validate(tempDir);
        assert.equal(exitCode, 1, "Should exit with 1 if directories are missing");
    } finally {
        process.exit = originalExit;
        console.error = originalError;
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test("ValidationService passes for valid structure", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-service-succ-"));
    
    // Scout scaffolding: features, .levit/decisions, .levit/handoff, core files
    const dirs = ["features", ".levit/decisions", ".levit/handoff"];
    dirs.forEach(d => fs.ensureDirSync(path.join(tempDir, d)));

    const files = ["SOCIAL_CONTRACT.md", ".levit/AGENT_CONTRACT.md", ".levit/AGENT_ONBOARDING.md"];
    files.forEach(f => fs.writeFileSync(path.join(tempDir, f), "content"));
    
    let exitCode: number | undefined;
    const originalExit = process.exit;
    process.exit = ((code?: number) => {
        exitCode = code ?? 0;
        return undefined as never;
    }) as any;

    try {
        ValidationService.validate(tempDir);
        // If it passes, it shouldn't call process.exit(1)
        assert.equal(exitCode, undefined);
    } finally {
        process.exit = originalExit;
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
