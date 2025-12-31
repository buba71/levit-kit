"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handoffCommand = handoffCommand;
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:readline/promises"));
const levit_project_1 = require("../core/levit_project");
const cli_args_1 = require("../core/cli_args");
const write_file_1 = require("../core/write_file");
function isoDate() {
    return new Date().toISOString().slice(0, 10);
}
async function handoffCommand(argv, cwd) {
    const { positional, flags } = (0, cli_args_1.parseArgs)(argv);
    const sub = positional[0];
    if (sub !== "new") {
        throw new Error("Usage: levit handoff new --feature <features/001-...md> [--role developer|qa|security|devops]");
    }
    const projectRoot = (0, levit_project_1.requireLevitProjectRoot)(cwd);
    const yes = (0, cli_args_1.getBooleanFlag)(flags, "yes");
    const overwrite = (0, cli_args_1.getBooleanFlag)(flags, "force");
    let feature = (0, cli_args_1.getStringFlag)(flags, "feature");
    let role = (0, cli_args_1.getStringFlag)(flags, "role");
    if (!yes) {
        const rl = promises_1.default.createInterface({ input: process.stdin, output: process.stdout });
        if (!feature) {
            feature = (await rl.question("Feature path (e.g. features/001-...md): ")).trim();
        }
        if (!role) {
            role = (await rl.question("Role [developer]: ")).trim() || "developer";
        }
        await rl.close();
    }
    if (!feature) {
        throw new Error("Missing --feature");
    }
    if (!role) {
        role = "developer";
    }
    const safeRole = role.trim().toLowerCase();
    const date = isoDate();
    const fileName = `${date}-${node_path_1.default.basename(feature, node_path_1.default.extname(feature))}-${safeRole}.md`;
    const handoffPath = node_path_1.default.join(projectRoot, ".levit", "handoff", fileName);
    const content = `# Agent Handoff\n\n- **Date**: ${date}\n- **Role**: ${safeRole}\n- **Feature**: ${feature}\n\n## What to read first\n- SOCIAL_CONTRACT.md\n- .levit/AGENT_ONBOARDING.md\n- ${feature}\n\n## Boundaries\nFollow the Boundaries section of the feature spec strictly.\n\n## Deliverables\n- A minimal, atomic diff\n- A short summary: what changed + why\n- How to verify (commands to run)\n- Open questions / risks\n\n## Review protocol\nFollow: .levit/workflows/submit-for-review.md\n`;
    (0, write_file_1.writeTextFile)(handoffPath, content, { overwrite });
    process.stdout.write(`Created ${node_path_1.default.relative(projectRoot, handoffPath)}\n`);
}
