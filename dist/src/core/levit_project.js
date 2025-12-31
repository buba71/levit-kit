"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLevitProjectRoot = findLevitProjectRoot;
exports.requireLevitProjectRoot = requireLevitProjectRoot;
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
function findLevitProjectRoot(startDir) {
    let current = node_path_1.default.resolve(startDir);
    while (true) {
        const marker = node_path_1.default.join(current, ".levit", "AGENT_ONBOARDING.md");
        if (fs_extra_1.default.existsSync(marker)) {
            return current;
        }
        const parent = node_path_1.default.dirname(current);
        if (parent === current) {
            return null;
        }
        current = parent;
    }
}
function requireLevitProjectRoot(startDir) {
    const root = findLevitProjectRoot(startDir);
    if (!root) {
        throw new Error("Not a levit project (missing .levit/AGENT_ONBOARDING.md). Run this command from a levit-initialized repository.");
    }
    return root;
}
