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
const init_1 = require("../src/init");
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
    // Agent boundaries
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "agents", "AGENTS.md")), "Agent guidelines should exist");
    // Feature contract
    node_assert_1.default.ok(exists(node_path_1.default.join(projectPath, "features", "README.md")), "Feature README should exist");
});
