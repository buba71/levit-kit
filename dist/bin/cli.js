#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../src/commands/init");
const decision_1 = require("../src/commands/decision");
const feature_1 = require("../src/commands/feature");
const handoff_1 = require("../src/commands/handoff");
const validate_1 = require("../src/commands/validate");
const version_1 = require("../src/core/version");
const node_path_1 = __importDefault(require("node:path"));
function showHelp() {
    console.log(`
Usage: levit [command] [options]

Commands:
  init <project-name>    Initialize a new levit project
  feature new            Create a new feature intent file (wizard)
  decision new           Create a new decision record (wizard)
  handoff new            Create an agent handoff brief (wizard)
  validate               Validate project cognitive scaffolding (cognitive linter)

Options:
  -v, --version          Show version number
  -h, --help             Show help
`);
}
async function main() {
    const args = process.argv.slice(2);
    if (args.includes("-h") || args.includes("--help") || args.length === 0) {
        showHelp();
        process.exit(0);
    }
    if (args.includes("-v") || args.includes("--version")) {
        console.log(`levit-kit v${(0, version_1.getVersion)()}`);
        process.exit(0);
    }
    if (args[0] === "init") {
        const projectName = args[1];
        if (!projectName) {
            console.error("Error: Project name is required.");
            console.error("Usage: levit init <project-name>");
            process.exit(1);
        }
        // Basic validation: ensure it's a valid directory name
        if (!/^[a-z0-9-_]+$/i.test(projectName)) {
            console.error("Error: Invalid project name. Use only letters, numbers, dashes, and underscores.");
            process.exit(1);
        }
        const targetPath = node_path_1.default.resolve(process.cwd(), projectName);
        try {
            (0, init_1.initProject)(projectName, targetPath);
        }
        catch (error) {
            console.error(error instanceof Error ? `Error: ${error.message}` : "Unexpected error");
            process.exit(1);
        }
    }
    else if (args[0] === "feature") {
        try {
            await (0, feature_1.featureCommand)(args.slice(1), process.cwd());
        }
        catch (error) {
            console.error(error instanceof Error ? `Error: ${error.message}` : "Unexpected error");
            process.exit(1);
        }
    }
    else if (args[0] === "decision") {
        try {
            await (0, decision_1.decisionCommand)(args.slice(1), process.cwd());
        }
        catch (error) {
            console.error(error instanceof Error ? `Error: ${error.message}` : "Unexpected error");
            process.exit(1);
        }
    }
    else if (args[0] === "handoff") {
        try {
            await (0, handoff_1.handoffCommand)(args.slice(1), process.cwd());
        }
        catch (error) {
            console.error(error instanceof Error ? `Error: ${error.message}` : "Unexpected error");
            process.exit(1);
        }
    }
    else if (args[0] === "validate") {
        try {
            await (0, validate_1.validateCommand)(args.slice(1), process.cwd());
        }
        catch (error) {
            console.error(error instanceof Error ? `Error: ${error.message}` : "Unexpected error");
            process.exit(1);
        }
    }
    else {
        console.error(`Error: Unknown command "${args[0]}"`);
        showHelp();
        process.exit(1);
    }
}
void main();
