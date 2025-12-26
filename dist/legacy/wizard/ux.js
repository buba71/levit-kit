"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askUX = askUX;
const inquirer_1 = __importDefault(require("inquirer"));
const defaults_1 = require("../../src/config/defaults");
async function askUX() {
    const defaultUX = Object.entries(defaults_1.DEFAULTS.ux)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    const { uxAgents } = await inquirer_1.default.prompt([
        {
            type: "checkbox",
            name: "uxAgents",
            message: "Select UX agents:",
            choices: [
                { name: "UX Presenter", value: "presenter" },
                { name: "UX Feedback Collector", value: "feedback_collector" }
            ],
            default: defaultUX
        }
    ]);
    return {
        presenter: uxAgents.includes("presenter"),
        feedback_collector: uxAgents.includes("feedback_collector")
    };
}
