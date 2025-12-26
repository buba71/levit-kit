#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../src/init");
const node_path_1 = __importDefault(require("node:path"));
function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args[0] !== "init") {
        console.error("Usage: levit init <project-name>");
        process.exit(1);
    }
    const projectName = args[1];
    const targetPath = node_path_1.default.resolve(process.cwd(), projectName);
    try {
        (0, init_1.initProject)(projectName, targetPath);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unexpected error");
        process.exit(1);
    }
}
main();
