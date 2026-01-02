import fs from "fs-extra";
import path from "node:path";
import { LevitError, LevitErrorCode } from "./errors";

/**
 * Maximum file size allowed for reading (10MB).
 * Prevents DoS attacks with very large files.
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates that a file path is within the base directory.
 * Prevents path traversal attacks (e.g., ../../../etc/passwd).
 * 
 * @param filePath - The file path to validate (can be relative or absolute)
 * @param baseDir - The base directory that the path must be within
 * @throws LevitError if path traversal is detected
 */
export function validatePath(filePath: string, baseDir: string): void {
  const resolvedPath = path.resolve(baseDir, filePath);
  const resolvedBase = path.resolve(baseDir);
  
  // Normalize paths to handle edge cases (e.g., trailing slashes)
  const normalizedPath = path.normalize(resolvedPath);
  const normalizedBase = path.normalize(resolvedBase);
  
  // Check if the resolved path starts with the base directory
  if (!normalizedPath.startsWith(normalizedBase + path.sep) && normalizedPath !== normalizedBase) {
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED,
      `Path traversal detected: "${filePath}" resolves outside base directory "${baseDir}"`
    );
  }
}

/**
 * Safely reads a file with size limit validation.
 * Prevents DoS attacks by limiting file size.
 * 
 * @param filePath - Path to the file to read
 * @param baseDir - Base directory for path validation (optional, for relative paths)
 * @param maxSize - Maximum file size in bytes (default: MAX_FILE_SIZE)
 * @returns File content as string
 * @throws LevitError if file is too large or path traversal detected
 */
export function readFileSafe(
  filePath: string,
  baseDir?: string,
  maxSize: number = MAX_FILE_SIZE
): string {
  // Validate path if baseDir is provided
  if (baseDir) {
    validatePath(filePath, baseDir);
  }
  
  // Resolve absolute path
  const absolutePath = baseDir ? path.resolve(baseDir, filePath) : path.resolve(filePath);
  
  // Check file exists
  if (!fs.existsSync(absolutePath)) {
    throw new LevitError(
      LevitErrorCode.MISSING_FILE,
      `File not found: ${filePath}`
    );
  }
  
  // Check file size before reading
  const stats = fs.statSync(absolutePath);
  if (stats.size > maxSize) {
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED,
      `File too large: ${filePath} (${stats.size} bytes, max: ${maxSize} bytes)`
    );
  }
  
  // Read file
  try {
    return fs.readFileSync(absolutePath, "utf-8");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED,
      `Failed to read file ${filePath}: ${message}`
    );
  }
}

/**
 * Safely writes a file with path validation.
 * 
 * @param targetPath - Path where to write the file
 * @param baseDir - Base directory for path validation
 * @param content - Content to write
 * @param options - Write options
 * @throws LevitError if path traversal detected
 */
export function writeFileSafe(
  targetPath: string,
  baseDir: string,
  content: string,
  options: { overwrite: boolean }
): void {
  // Validate path
  validatePath(targetPath, baseDir);
  
  // Resolve absolute path
  const absolutePath = path.resolve(baseDir, targetPath);
  
  // Ensure directory exists
  fs.ensureDirSync(path.dirname(absolutePath));
  
  // Check if file exists and overwrite is not allowed
  if (fs.existsSync(absolutePath) && !options.overwrite) {
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED,
      `File already exists: ${targetPath}`
    );
  }
  
  // Write file
  try {
    fs.writeFileSync(absolutePath, content, "utf8");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED,
      `Failed to write file ${targetPath}: ${message}`
    );
  }
}

/**
 * Validates that a directory path is within the base directory.
 * 
 * @param dirPath - The directory path to validate
 * @param baseDir - The base directory
 * @throws LevitError if path traversal is detected
 */
export function validateDirectoryPath(dirPath: string, baseDir: string): void {
  validatePath(dirPath, baseDir);
  
  const resolvedPath = path.resolve(baseDir, dirPath);
  if (!fs.existsSync(resolvedPath)) {
    return; // Directory doesn't exist yet, but path is valid
  }
  
  const stats = fs.statSync(resolvedPath);
  if (!stats.isDirectory()) {
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED,
      `Path is not a directory: ${dirPath}`
    );
  }
}

