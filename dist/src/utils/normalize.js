"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeProjectName = normalizeProjectName;
function normalizeProjectName(input) {
    return input
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-") // espaces → tirets
        .replace(/[^a-z0-9-]/g, "") // caractères non sûrs
        .replace(/-+/g, "-"); // éviter --- multiples
}
