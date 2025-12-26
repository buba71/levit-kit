"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmSummary = confirmSummary;
const inquirer_1 = __importDefault(require("inquirer"));
async function confirmSummary(config) {
    console.log("\n📋 Project summary\n");
    console.log(`Project: ${config.projectName}\n`);
    console.log("Agents:");
    Object.entries(config.agents).forEach(([k, v]) => {
        if (v)
            console.log(`  - ${k}`);
    });
    console.log("\nUX:");
    Object.entries(config.ux).forEach(([k, v]) => {
        if (v)
            console.log(`  - ${k}`);
    });
    console.log("\nQuality:");
    Object.entries(config.quality).forEach(([k, v]) => {
        if (v)
            console.log(`  - ${k}`);
    });
    console.log("\nDevOps:");
    if (config.devops.enabled) {
        console.log("  - CI/CD enabled");
        if (config.devops.environments.staging)
            console.log("  - staging");
        if (config.devops.environments.production)
            console.log("  - production");
        if (config.devops.require_human_approval_for_prod) {
            console.log("  - human approval before prod");
        }
    }
    else {
        console.log("  - disabled");
    }
    const { confirm } = await inquirer_1.default.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Proceed with project generation?",
            default: true
        }
    ]);
    return confirm;
}
