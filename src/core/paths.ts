import path from "node:path";

/**
 * Resolves the root directory of the levit-kit package.
 * Assuming this file is at src/core/paths.ts, 
 * after compilation it will be at dist/src/core/paths.js.
 */
export function getPackageRoot(): string {
  return path.resolve(__dirname, "..", "..", "..");
}

/**
 * Returns the absolute path to the templates directory.
 */
export function getTemplatesPath(): string {
  return path.join(getPackageRoot(), "templates");
}

/**
 * Returns the absolute path to a specific template.
 */
export function getTemplatePath(templateName: string = "default"): string {
  return path.join(getTemplatesPath(), templateName);
}
