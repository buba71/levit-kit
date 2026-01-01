"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decisionCommand = decisionCommand;
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
async function decisionCommand(argv, cwd) {
    const { positional, flags } = (0, cli_args_1.parseArgs)(argv);
    const sub = positional[0];
    if (sub !== "new") {
        throw new Error('Usage: levit decision new [--title "..."] [--id "001"]');
    }
    const projectRoot = (0, levit_project_1.requireLevitProjectRoot)(cwd);
    const yes = (0, cli_args_1.getBooleanFlag)(flags, "yes");
    const overwrite = (0, cli_args_1.getBooleanFlag)(flags, "force");
    let title = (0, cli_args_1.getStringFlag)(flags, "title");
    let id = (0, cli_args_1.getStringFlag)(flags, "id");
    const featureRef = (0, cli_args_1.getStringFlag)(flags, "feature");
    const computedId = (0, ids_1.nextSequentialId)(node_path_1.default.join(projectRoot, ".levit", "decisions"), /^ADR-(\d+)-/);
    if (!yes) {
        const rl = promises_1.default.createInterface({ input: process.stdin, output: process.stdout });
        if (!title) {
            title = (await rl.question("Decision title: ")).trim();
        }
        if (!id) {
            id = (await rl.question(`Decision id [${computedId}]: `)).trim() || computedId;
        }
        await rl.close();
    }
    if (!id) {
        id = computedId;
    }
    if (!title) {
        throw new Error("Missing --title");
    }
    if (!id) {
        throw new Error("Missing --id");
    }
    const slug = normalizeSlug(title);
    const fileName = `ADR-${id}-${slug}.md`;
    const decisionPath = node_path_1.default.join(projectRoot, ".levit", "decisions", fileName);
    const date = new Date().toISOString().split("T")[0];
    const frontmatter = `---
id: ADR-${id}
status: draft
owner: human
last_updated: ${date}
risk_level: low
depends_on: [${featureRef || ""}]
---

`;
    const featureLine = featureRef ? `- **Feature**: ${featureRef}\n` : "";
    const content = `${frontmatter}# ADR ${id}: ${title}\n\n- **Date**: ${date}\n- **Status**: [Draft / Proposed / Approved]\n${featureLine}\n## Context\n[fill]\n\n## Decision\n[fill]\n\n## Rationale\n[fill]\n\n## Alternatives Considered\n[fill]\n\n## Consequences\n[fill]\n`;
    (0, write_file_1.writeTextFile)(decisionPath, content, { overwrite });
    process.stdout.write(`Created ${node_path_1.default.relative(projectRoot, decisionPath)}\n`);
}
