"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = parseArgs;
exports.getStringFlag = getStringFlag;
exports.getBooleanFlag = getBooleanFlag;
function parseArgs(args) {
    const positional = [];
    const flags = {};
    for (let i = 0; i < args.length; i += 1) {
        const token = args[i];
        if (!token.startsWith("--")) {
            positional.push(token);
            continue;
        }
        const key = token.slice(2);
        const next = args[i + 1];
        if (!next || next.startsWith("--")) {
            flags[key] = true;
            continue;
        }
        flags[key] = next;
        i += 1;
    }
    return { positional, flags };
}
function getStringFlag(flags, key) {
    const v = flags[key];
    if (typeof v === "string") {
        return v;
    }
    return undefined;
}
function getBooleanFlag(flags, key) {
    return flags[key] === true;
}
