"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handoffCommand = handoffCommand;
const promises_1 = __importDefault(require("node:readline/promises"));
const levit_project_1 = require("../core/levit_project");
const cli_args_1 = require("../core/cli_args");
const handoff_service_1 = require("../services/handoff_service");
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
    handoff_service_1.HandoffService.createHandoff(projectRoot, { feature, role, overwrite });
}
