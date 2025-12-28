"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = getVersion;
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const paths_1 = require("./paths");
/**
 * Reads and returns the version from the package.json.
 */
function getVersion() {
    try {
        const packageJsonPath = node_path_1.default.join((0, paths_1.getPackageRoot)(), "package.json");
        const packageJson = fs_extra_1.default.readJsonSync(packageJsonPath);
        return packageJson.version || "unknown";
    }
    catch {
        return "unknown";
    }
}
