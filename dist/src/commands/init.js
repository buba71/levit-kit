"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = initProject;
const fs_extra_1 = __importDefault(require("fs-extra"));
const paths_1 = require("../core/paths");
const version_1 = require("../core/version");
const init_1 = require("../init");
/**
 * Initializes a new project by copying the default template.
 *
 * @param projectName The name of the project to create
 * @param targetPath The absolute path where the project should be created
 */
function initProject(projectName, targetPath) {
    const templatePath = (0, paths_1.getTemplatePath)("default");
    const version = (0, version_1.getVersion)();
    if (!projectName) {
        throw new Error("Project name is required.");
    }
    // Ensure project name is valid for a directory
    if (!/^[a-z0-9-_]+$/i.test(projectName)) {
        throw new Error("Invalid project name. Use only letters, numbers, dashes, and underscores.");
    }
    if (fs_extra_1.default.existsSync(targetPath)) {
        throw new Error(`Directory "${projectName}" already exists.`);
    }
    if (!fs_extra_1.default.existsSync(templatePath)) {
        throw new Error(`Default template not found at ${templatePath}`);
    }
    try {
        (0, init_1.generateProject)(targetPath, "default");
        console.log("");
        console.log(`🚀 levit-kit v${version}`);
        console.log("");
        console.log("  ✔ Structure initialized");
        console.log("  ✔ Conventions applied");
        console.log("");
        console.log(`✨ Project "${projectName}" is ready for development.`);
        console.log("");
        console.log("Next steps:");
        console.log(`  1. cd ${projectName}`);
        console.log("  2. Review SOCIAL_CONTRACT.md to understand the foundations");
        console.log("  3. Define your first feature in features/README.md");
        console.log("");
    }
    catch (error) {
        // Attempt clean up if directory was created but copy failed
        if (fs_extra_1.default.existsSync(targetPath) && fs_extra_1.default.readdirSync(targetPath).length === 0) {
            fs_extra_1.default.rmSync(targetPath, { recursive: true, force: true });
        }
        throw error;
    }
}
