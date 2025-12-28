import fs from "fs-extra";
import path from "node:path";
import { getPackageRoot } from "./paths";

/**
 * Reads and returns the version from the package.json.
 */
export function getVersion(): string {
  try {
    const packageJsonPath = path.join(getPackageRoot(), "package.json");
    const packageJson = fs.readJsonSync(packageJsonPath);
    return packageJson.version || "unknown";
  } catch {
    return "unknown";
  }
}
