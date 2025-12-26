"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = initProject;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function getPackageRoot() {
    // Use __dirname to reliably locate the package root relative to this file
    // compiled file is in dist/src/init.js, so we go up two levels to reach package root
    return node_path_1.default.resolve(__dirname, "..", "..");
}
function initProject(projectName, targetPath) {
    const packageRoot = getPackageRoot();
    const templatePath = node_path_1.default.join(packageRoot, "templates", "default");
    if (!projectName) {
        throw new Error("Project name is required.");
    }
    if (node_fs_1.default.existsSync(targetPath)) {
        throw new Error(`Directory "${projectName}" already exists.`);
    }
    if (!node_fs_1.default.existsSync(templatePath)) {
        throw new Error(`Default template not found at ${templatePath}`);
    }
    node_fs_1.default.mkdirSync(targetPath, { recursive: true });
    copyDirectory(templatePath, targetPath);
    console.log("");
    console.log("levit-kit v1.0");
    console.log("");
    console.log("✔ Project directory created");
    console.log("✔ Template copied");
    console.log("");
    console.log(`Project "${projectName}" initialized successfully.`);
    console.log("");
    console.log("Next steps:");
    console.log("  - Open the project");
    console.log("  - Read SOCIAL_CONTRACT.md");
    console.log("  - Start defining features");
}
function copyDirectory(source, target) {
    const entries = node_fs_1.default.readdirSync(source, { withFileTypes: true });
    for (const entry of entries) {
        const sourcePath = node_path_1.default.join(source, entry.name);
        const targetPath = node_path_1.default.join(target, entry.name);
        if (entry.isDirectory()) {
            node_fs_1.default.mkdirSync(targetPath, { recursive: true });
            copyDirectory(sourcePath, targetPath);
        }
        else {
            node_fs_1.default.copyFileSync(sourcePath, targetPath);
        }
    }
}
