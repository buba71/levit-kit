"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageRoot = getPackageRoot;
exports.getTemplatesPath = getTemplatesPath;
exports.getTemplatePath = getTemplatePath;
const node_path_1 = __importDefault(require("node:path"));
/**
 * Resolves the root directory of the levit-kit package.
 * Assuming this file is at src/core/paths.ts,
 * after compilation it will be at dist/src/core/paths.js.
 */
function getPackageRoot() {
    return node_path_1.default.resolve(__dirname, "..", "..", "..");
}
/**
 * Returns the absolute path to the templates directory.
 */
function getTemplatesPath() {
    return node_path_1.default.join(getPackageRoot(), "templates");
}
/**
 * Returns the absolute path to a specific template.
 */
function getTemplatePath(templateName = "default") {
    return node_path_1.default.join(getTemplatesPath(), templateName);
}
