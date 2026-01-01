import fs from "fs-extra";
import path from "node:path";
import { getTemplatePath } from "../core/paths";
import { Logger } from "../core/logger";
import { LevitError, LevitErrorCode } from "../core/errors";

export class ProjectService {
  static init(projectName: string, targetPath: string, templateName: string = "default") {
    const templatePath = getTemplatePath(templateName);

    if (!fs.existsSync(templatePath)) {
      throw new LevitError(LevitErrorCode.TEMPLATE_NOT_FOUND, `Template "${templateName}" not found at ${templatePath}`);
    }

    if (fs.existsSync(targetPath) && fs.readdirSync(targetPath).length > 0) {
      throw new LevitError(LevitErrorCode.INIT_FAILED, `Target directory "${targetPath}" is not empty.`);
    }

    try {
      fs.ensureDirSync(targetPath);
      fs.copySync(templatePath, targetPath);

      // Customize manifest
      const manifestPath = path.join(targetPath, "levit.json");
      if (fs.existsSync(manifestPath)) {
        const manifest = fs.readJsonSync(manifestPath);
        manifest.name = projectName;
        manifest.last_validated = new Date().toISOString();
        fs.writeJsonSync(manifestPath, manifest, { spaces: 2 });
      }

      Logger.info(`Project "${projectName}" initialized successfully at ${targetPath}`);
    } catch (error) {
       throw new LevitError(LevitErrorCode.INIT_FAILED, `Failed to initialize project: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
