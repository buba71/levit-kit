"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureCommand = featureCommand;
const promises_1 = __importDefault(require("node:readline/promises"));
const levit_project_1 = require("../core/levit_project");
const cli_args_1 = require("../core/cli_args");
const feature_service_1 = require("../services/feature_service");
function normalizeSlug(input) {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-_]/g, "")
        .replace(/\s+/g, "-");
}
async function featureCommand(argv, cwd) {
    const { positional, flags } = (0, cli_args_1.parseArgs)(argv);
    const sub = positional[0];
    if (sub !== "new") {
        throw new Error('Usage: levit feature new [--title "..."] [--slug "..."] [--id "001"]');
    }
    const projectRoot = (0, levit_project_1.requireLevitProjectRoot)(cwd);
    const yes = (0, cli_args_1.getBooleanFlag)(flags, "yes");
    const overwrite = (0, cli_args_1.getBooleanFlag)(flags, "force");
    let title = (0, cli_args_1.getStringFlag)(flags, "title");
    let slug = (0, cli_args_1.getStringFlag)(flags, "slug");
    let id = (0, cli_args_1.getStringFlag)(flags, "id");
    if (!yes) {
        const rl = promises_1.default.createInterface({ input: process.stdin, output: process.stdout });
        if (!title) {
            title = (await rl.question("Feature title: ")).trim();
        }
        if (!slug) {
            const computed = normalizeSlug(title || "");
            slug = (await rl.question(`Feature slug [${computed}]: `)).trim() || computed;
        }
        await rl.close();
    }
    if (!title) {
        throw new Error("Missing --title");
    }
    if (!slug) {
        throw new Error("Missing --slug");
    }
    feature_service_1.FeatureService.createFeature(projectRoot, { title, slug, id, overwrite });
}
