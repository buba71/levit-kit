"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const node_child_process_1 = require("node:child_process");
const init_1 = require("../src/commands/init");
function exists(p) {
    return node_fs_1.default.existsSync(p);
}
(0, node_test_1.default)("levit init copies default template exactly", () => {
    const tempDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "levit-kit-test-"));
    const projectName = "test-project";
    const projectPath = node_path_1.default.join(tempDir, projectName);
    (0, init_1.initProject)(projectName, projectPath);
    // Core structure assertions
    node_assert_1.default.ok(exists(projectPath), "Project directory should exist");
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "README.md")));
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "SOCIAL_CONTRACT.md")));
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "features")));
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "agents")));
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "roles")));
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "pipelines")));
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "docs")));
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "roles", "README.md")), "Roles README should exist");
    // AIDD assertions
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, ".levit")), ".levit directory should exist");
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, ".levit", "AGENT_ONBOARDING.md")), "AGENT_ONBOARDING.md should exist");
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, ".levit", "decision-record.md")), "decision-record.md should exist");
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, ".levit", "workflows", "example-task.md")), "Example workflow should exist");
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, ".levit", "workflows", "submit-for-review.md")), "Submit for review workflow should exist");
    // New files assertions
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, ".gitignore")), ".gitignore should exist");
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "package.json")), "package.json should exist");
    // Agent boundaries
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "agents", "AGENTS.md")), "Agent guidelines should exist");
    // Feature contract
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "features", "README.md")), "Feature README should exist");
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "features", "INTENT.md")), "Feature INTENT template should exist");
    // Clean up
    node_fs_1.default.rmSync(tempDir, { recursive: true, force: true });
});
(0, node_test_1.default)("CLI --help works", () => {
    const output = (0, node_child_process_1.execSync)("node dist/bin/cli.js --help").toString();
    node_assert_1.default.ok(output.includes("Usage: levit [command] [options]"));
    node_assert_1.default.ok(output.includes("init <project-name>"));
});
(0, node_test_1.default)("CLI --version works", () => {
    const output = (0, node_child_process_1.execSync)("node dist/bin/cli.js --version").toString();
    node_assert_1.default.ok(output.startsWith("levit-kit v"));
});
(0, node_test_1.default)("CLI name validation works", () => {
    try {
        (0, node_child_process_1.execSync)("node dist/bin/cli.js init invalid/name");
        node_assert_1.default.fail("Should have failed with invalid name");
    }
    catch (error) {
        node_assert_1.default.ok(error.stderr.toString().includes("Error: Invalid project name"));
    }
});
