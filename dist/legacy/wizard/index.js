"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWizard = runWizard;
const inquirer_1 = __importDefault(require("inquirer"));
const normalize_1 = require("../../src/utils/normalize");
const agents_1 = require("./agents");
const ux_1 = require("./ux");
const quality_1 = require("./quality");
const devops_1 = require("./devops");
const summary_1 = require("./summary");
async function runWizard() {
    const { rawProjectName } = await inquirer_1.default.prompt([
        {
            type: "input",
            name: "rawProjectName",
            message: "Project name:",
            validate: (v) => !!v || "Project name required"
        }
    ]);
    const projectName = (0, normalize_1.normalizeProjectName)(rawProjectName);
    if (projectName !== rawProjectName) {
        console.log(`ℹ️  Project name normalized to: ${projectName}`);
    }
    const agents = await (0, agents_1.askAgents)();
    const ux = await (0, ux_1.askUX)();
    const quality = await (0, quality_1.askQuality)();
    const devops = await (0, devops_1.askDevOps)();
    const config = {
        projectName,
        agents,
        ux,
        quality,
        devops
    };
    const confirmed = await (0, summary_1.confirmSummary)(config);
    if (!confirmed) {
        console.log("❌ Project generation cancelled.");
        process.exit(0);
    }
    return config;
}
