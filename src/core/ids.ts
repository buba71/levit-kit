import fs from "fs-extra";
import path from "node:path";

/**
 * Finds the next sequential 3-digit ID in a directory based on a filename pattern.
 * 
 * @param directory The directory to scan
 * @param pattern A regex with a single capture group for the ID number
 * @returns The next ID as a zero-padded string (e.g., "001")
 */
export function nextSequentialId(directory: string, pattern: RegExp): string {
  if (!fs.existsSync(directory)) {
    return "001";
  }

  const files = fs.readdirSync(directory);

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
