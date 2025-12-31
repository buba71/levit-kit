"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureCommand = featureCommand;
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:readline/promises"));
const levit_project_1 = require("../core/levit_project");
const cli_args_1 = require("../core/cli_args");
const write_file_1 = require("../core/write_file");
const ids_1 = require("../core/ids");
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
    const computedId = (0, ids_1.nextSequentialId)(node_path_1.default.join(projectRoot, "features"), /^(\d+)-/);
    if (!yes) {
        const rl = promises_1.default.createInterface({ input: process.stdin, output: process.stdout });
        if (!title) {
            title = (await rl.question("Feature title: ")).trim();
        }
        if (!slug) {
            const computed = normalizeSlug(title || "");
            slug = (await rl.question(`Feature slug [${computed}]: `)).trim() || computed;
        }
        if (!id) {
            id = (await rl.question(`Feature id [${computedId}]: `)).trim() || computedId;
        }
        await rl.close();
    }
    if (!id) {
        id = computedId;
    }
    if (!title) {
        throw new Error("Missing --title");
    }
    if (!slug) {
        throw new Error("Missing --slug");
    }
    const fileName = `${id}-${slug}.md`;
    const featurePath = node_path_1.default.join(projectRoot, "features", fileName);
    const content = `# INTENT: ${title}\n\n## 1. Vision (The \"Why\")\n- **User Story**: [fill]\n- **Priority**: [Low / Medium / High / Critical]\n\n## 2. Success Criteria (The \"What\")\n- [ ] Criterion 1\n\n## 3. Boundaries (The \"No\")\n- Non-goal 1\n\n## 4. Technical Constraints\n- [fill]\n\n## 5. Agent Task\n- [fill]\n`;
    (0, write_file_1.writeTextFile)(featurePath, content, { overwrite });
    process.stdout.write(`Created ${node_path_1.default.relative(projectRoot, featurePath)}\n`);
}
