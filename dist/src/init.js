"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = initProject;
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
function getPackageRoot() {
    // Use __dirname to reliably locate the package root relative to this file
    // compiled file is in dist/src/init.js, so we go up two levels to reach package root
    return node_path_1.default.resolve(__dirname, "..", "..");
}
function getVersion() {
    try {
        const packageJson = fs_extra_1.default.readJsonSync(node_path_1.default.join(getPackageRoot(), "package.json"));
        return packageJson.version;
    }
    catch {
        return "0.0.0";
    }
}
function initProject(projectName, targetPath) {
    const packageRoot = getPackageRoot();
    const templatePath = node_path_1.default.join(packageRoot, "templates", "default");
    const version = getVersion();
    if (!projectName) {
        throw new Error("Project name is required.");
    }
    if (fs_extra_1.default.existsSync(targetPath)) {
        throw new Error(`Directory "${projectName}" already exists.`);
    }
    if (!fs_extra_1.default.existsSync(templatePath)) {
        throw new Error(`Default template not found at ${templatePath}`);
    }
    fs_extra_1.default.ensureDirSync(targetPath);
    fs_extra_1.default.copySync(templatePath, targetPath);
    console.log("");
    console.log(`🚀 levit-kit v${version}`);
    console.log("");
    console.log("  ✔ Project directory created");
    console.log("  ✔ Template copied");
    console.log("");
    console.log(`✨ Project "${projectName}" initialized successfully.`);
    console.log("");
    console.log("Next steps:");
    console.log(`  - cd ${projectName}`);
    console.log("  - Read SOCIAL_CONTRACT.md");
    console.log("  - Start defining features");
    console.log("");
}
