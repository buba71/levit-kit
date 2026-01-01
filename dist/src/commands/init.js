"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = initProject;
const logger_1 = require("../core/logger");
const version_1 = require("../core/version");
const project_service_1 = require("../services/project_service");
function initProject(projectName, targetPath) {
    const version = (0, version_1.getVersion)();
    if (!projectName) {
        throw new Error("Project name is required.");
    }
    // Ensure project name is valid for a directory
    if (!/^[a-z0-9-_]+$/i.test(projectName)) {
        throw new Error("Invalid project name. Use only letters, numbers, dashes, and underscores.");
    }
    project_service_1.ProjectService.init(projectName, targetPath);
    logger_1.Logger.info(`🚀 levit-kit v${version}`);
    logger_1.Logger.info(`✨ Project "${projectName}" is ready for development.`);
    console.log("");
    console.log("Next steps:");
    console.log(`  1. cd ${projectName}`);
    console.log("  2. Read README.md for the Human Operator Guide");
    console.log("  3. Onboard your AI in .levit/AGENT_ONBOARDING.md");
    console.log("");
}
