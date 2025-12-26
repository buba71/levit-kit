"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askDevOps = askDevOps;
const inquirer_1 = __importDefault(require("inquirer"));
const defaults_1 = require("../../src/config/defaults");
async function askDevOps() {
    const { enabled } = await inquirer_1.default.prompt([
        {
            type: "confirm",
            name: "enabled",
            message: "Enable CI/CD (DevOps agent)?",
            default: defaults_1.DEFAULTS.devops.enabled
        }
    ]);
    if (!enabled) {
        return {
            enabled: false,
            environments: {
                staging: false,
                production: false
            },
            require_human_approval_for_prod: defaults_1.DEFAULTS.devops.require_human_approval_for_prod
        };
    }
    const defaultEnvs = Object.entries(defaults_1.DEFAULTS.devops.environments)
        .filter(([, enabled]) => enabled)
        .map(([env]) => env);
    const { environments } = await inquirer_1.default.prompt([
        {
            type: "checkbox",
            name: "environments",
            message: "Select deployment environments:",
            choices: [
                { name: "Staging", value: "staging" },
                { name: "Production", value: "production" }
            ],
            default: defaultEnvs // évite l’état vide
        }
    ]);
    const { require_human_approval_for_prod } = await inquirer_1.default.prompt([
        {
            type: "confirm",
            name: "require_human_approval_for_prod",
            message: "Require human approval before production deploy?",
            default: defaults_1.DEFAULTS.devops.require_human_approval_for_prod
        }
    ]);
    return {
        enabled: true,
        environments: {
            staging: environments.includes("staging"),
            production: environments.includes("production")
        },
        require_human_approval_for_prod
    };
}
