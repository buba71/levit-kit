import fs from "fs-extra";
import path from "node:path";
import { getTemplatePath } from "./core/paths";

/**
 * Core generation logic for a new project.
 * Responsible only for file system operations.
 */
export function generateProject(targetPath: string, templateName: string = "default") {
  const templatePath = getTemplatePath(templateName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${templateName}" not found.`);
  }

  if (fs.existsSync(targetPath) && fs.readdirSync(targetPath).length > 0) {
    throw new Error(`Target directory "${targetPath}" is not empty.`);
  }

  fs.ensureDirSync(targetPath);
  fs.copySync(templatePath, targetPath);
}
