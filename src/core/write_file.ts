import path from "node:path";
import { writeFileSafe } from "./security";

export type WriteOptions = {
  overwrite: boolean;
};

/**
 * Writes a text file with path validation.
 * For internal use (within project root), use writeFileSafe directly.
 * This function is kept for backward compatibility but validates paths.
 */
export function writeTextFile(targetPath: string, content: string, options: WriteOptions) {
  // For absolute paths, validate against the directory containing the file
  // For relative paths, this should be called with a baseDir context
  // This is a fallback - prefer using writeFileSafe with explicit baseDir
  const baseDir = path.isAbsolute(targetPath) ? path.dirname(targetPath) : process.cwd();
  writeFileSafe(targetPath, baseDir, content, options);
}
