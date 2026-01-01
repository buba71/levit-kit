import fs from "fs-extra";
import path from "node:path";
import { getTemplatePath } from "./core/paths";
import { DEFAULT_MANIFEST } from "./types/manifest";
import { ManifestService } from "./services/manifest_service";

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

  // Generate enriched levit.json manifest
  const manifest = { ...DEFAULT_MANIFEST };
  manifest.project.name = path.basename(targetPath);
  
  ManifestService.write(targetPath, manifest);
  
  // Sync features and roles from template
  ManifestService.sync(targetPath);
}
