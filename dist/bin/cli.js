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
const logger_1 = require("../src/core/logger");
const errors_1 = require("../src/core/errors");
function showHelp() {
    logger_1.Logger.info(`
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
  --json                 Output in JSON format
`);
}
async function main() {
    const args = process.argv.slice(2);
    if (args.includes("--json")) {
        logger_1.Logger.setJsonMode(true);
    }
    if (args.includes("-h") || args.includes("--help") || args.length === 0) {
        showHelp();
        process.exit(0);
    }
    if (args.includes("-v") || args.includes("--version")) {
        console.log(`levit-kit v${(0, version_1.getVersion)()}`);
        process.exit(0);
    }
    const command = args[0];
    try {
        switch (command) {
            case "init":
                const projectName = args[1];
                if (!projectName) {
                    throw new Error("Project name is required. Usage: levit init <project-name>");
                }
                (0, init_1.initProject)(projectName, node_path_1.default.resolve(process.cwd(), projectName));
                break;
            case "feature":
                await (0, feature_1.featureCommand)(args.slice(1), process.cwd());
                break;
            case "decision":
                await (0, decision_1.decisionCommand)(args.slice(1), process.cwd());
                break;
            case "handoff":
                await (0, handoff_1.handoffCommand)(args.slice(1), process.cwd());
                break;
            case "validate":
                await (0, validate_1.validateCommand)(args.slice(1), process.cwd());
                break;
            default:
                logger_1.Logger.error(`Unknown command "${command}"`);
                showHelp();
                process.exit(1);
        }
    }
    catch (error) {
        if (error instanceof errors_1.LevitError) {
            logger_1.Logger.error(`${error.message} (Code: ${error.code})`);
        }
        else {
            logger_1.Logger.error(error instanceof Error ? error.message : "Unexpected error", error);
        }
        process.exit(1);
    }
}
void main();
