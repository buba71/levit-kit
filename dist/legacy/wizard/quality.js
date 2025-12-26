"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuality = askQuality;
const inquirer_1 = __importDefault(require("inquirer"));
const defaults_1 = require("../../src/config/defaults");
async function askQuality() {
    const answers = await inquirer_1.default.prompt([
        {
            type: "confirm",
            name: "tests_required",
            message: "Require automated tests?",
            default: defaults_1.DEFAULTS.quality.tests_required
        },
        {
            type: "confirm",
            name: "code_review_required",
            message: "Require code review?",
            default: defaults_1.DEFAULTS.quality.code_review_required
        },
        {
            type: "confirm",
            name: "human_validation_required",
            message: "Require human validation for critical actions?",
            default: defaults_1.DEFAULTS.quality.human_validation_required
        }
    ]);
    return answers;
}
