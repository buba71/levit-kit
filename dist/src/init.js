"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProject = generateProject;
const fs_extra_1 = __importDefault(require("fs-extra"));
const paths_1 = require("./core/paths");
/**
 * Core generation logic for a new project.
 * Responsible only for file system operations.
 */
function generateProject(targetPath, templateName = "default") {
    const templatePath = (0, paths_1.getTemplatePath)(templateName);
    if (!fs_extra_1.default.existsSync(templatePath)) {
        throw new Error(`Template "${templateName}" not found.`);
    }
    if (fs_extra_1.default.existsSync(targetPath) && fs_extra_1.default.readdirSync(targetPath).length > 0) {
        throw new Error(`Target directory "${targetPath}" is not empty.`);
    }
    fs_extra_1.default.ensureDirSync(targetPath);
    fs_extra_1.default.copySync(templatePath, targetPath);
}
