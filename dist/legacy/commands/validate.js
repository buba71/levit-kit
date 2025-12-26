"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommand = validateCommand;
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = __importDefault(require("path"));
const antigravity_schema_1 = require("../../src/schema/antigravity.schema");
async function validateCommand(filePath = "antigravity.yaml") {
    const absolutePath = path_1.default.resolve(process.cwd(), filePath);
    if (!(await fs_extra_1.default.pathExists(absolutePath))) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
    const raw = await fs_extra_1.default.readFile(absolutePath, "utf-8");
    const parsed = js_yaml_1.default.load(raw);
    const result = antigravity_schema_1.AntigravitySchema.safeParse(parsed);
    if (!result.success) {
        console.error("❌ Invalid antigravity.yaml");
        console.error(result.error.format());
        process.exit(1);
    }
    console.log("✅ antigravity.yaml is valid");
}
