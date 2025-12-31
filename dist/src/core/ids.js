"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextSequentialId = nextSequentialId;
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * Finds the next sequential 3-digit ID in a directory based on a filename pattern.
 *
 * @param directory The directory to scan
 * @param pattern A regex with a single capture group for the ID number
 * @returns The next ID as a zero-padded string (e.g., "001")
 */
function nextSequentialId(directory, pattern) {
    if (!fs_extra_1.default.existsSync(directory)) {
        return "001";
    }
    const files = fs_extra_1.default.readdirSync(directory);
    let max = 0;
    for (const f of files) {
        const m = f.match(pattern);
        if (!m) {
            continue;
        }
        const n = Number.parseInt(m[1], 10);
        if (!Number.isFinite(n)) {
            continue;
        }
        max = Math.max(max, n);
    }
    const next = max + 1;
    return String(next).padStart(3, "0");
}
