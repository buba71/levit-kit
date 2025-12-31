"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTextFile = writeTextFile;
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
function writeTextFile(targetPath, content, options) {
    fs_extra_1.default.ensureDirSync(node_path_1.default.dirname(targetPath));
    if (fs_extra_1.default.existsSync(targetPath) && !options.overwrite) {
        throw new Error(`File already exists: ${targetPath}`);
    }
    fs_extra_1.default.writeFileSync(targetPath, content, "utf8");
}
