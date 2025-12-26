"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAgents = askAgents;
const inquirer_1 = __importDefault(require("inquirer"));
const defaults_1 = require("../../src/config/defaults");
async function askAgents() {
    const defaultAgents = Object.entries(defaults_1.DEFAULTS.agents)
        .filter(([, enabled]) => enabled)
        .map(([agent]) => agent);
    const { selectedAgents } = await inquirer_1.default.prompt([
        {
            type: "checkbox",
            name: "selectedAgents",
            message: "Select the agents to enable:",
            choices: [
                { name: "Product Owner", value: "product_owner" },
                { name: "Code Reviewer", value: "code_reviewer" },
                { name: "QA", value: "qa" },
                { name: "Security", value: "security" },
                { name: "DevOps (CI/CD)", value: "devops" }
            ],
            default: defaultAgents
        }
    ]);
    return {
        product_owner: selectedAgents.includes("product_owner"),
        developer: true, // toujours actif
        code_reviewer: selectedAgents.includes("code_reviewer"),
        qa: selectedAgents.includes("qa"),
        security: selectedAgents.includes("security"),
        devops: selectedAgents.includes("devops")
    };
}
