"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const wizard_1 = require("../legacy/wizard");
const validator_1 = require("./config/validator");
const generator_1 = require("./generator");
const validate_1 = require("../legacy/commands/validate");
async function initCommand() {
    console.log("🚀 Create Antigravity Project\n");
    const projectConfig = await (0, wizard_1.runWizard)();
    (0, validator_1.validateConfig)(projectConfig);
    await (0, generator_1.generateProject)(projectConfig);
    console.log("\n✅ Project initialized successfully");
}
async function run() {
    const command = process.argv[2];
    switch (command) {
        case "validate":
            await (0, validate_1.validateCommand)(process.argv[3]);
            break;
        case "init":
        default:
            await initCommand();
            break;
    }
}
