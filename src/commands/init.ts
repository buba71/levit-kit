import readline from "node:readline/promises";
import { Logger } from "../core/logger";
import { getVersion } from "../core/version";
import { ProjectService } from "../services/project_service";
import { LevitError, LevitErrorCode } from "../core/errors";
import { getTemplatesPath } from "../core/paths";
import fs from "fs-extra";

export async function initProject(projectName: string, targetPath: string, templateName?: string) {
  const version = getVersion();

  if (!projectName) {
    throw new LevitError(LevitErrorCode.MISSING_REQUIRED_ARG, "Project name is required.");
  }

  // Ensure project name is valid for a directory
  if (!/^[a-z0-9-_]+$/i.test(projectName)) {
    throw new LevitError(
      LevitErrorCode.INVALID_PROJECT_NAME,
      "Invalid project name. Use only letters, numbers, dashes, and underscores."
    );
  }

  // If template not provided, list available templates and prompt
  if (!templateName) {
    const availableTemplates = listAvailableTemplates();
    if (availableTemplates.length > 1) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      Logger.info("\nAvailable templates:");
      availableTemplates.forEach((t, i) => {
        Logger.info(`  ${i + 1}. ${t}`);
      });
      const choice = await rl.question(`\nSelect template [1-${availableTemplates.length}] (default: 1): `);
      rl.close();
      
      const index = choice.trim() ? parseInt(choice.trim(), 10) - 1 : 0;
      if (index >= 0 && index < availableTemplates.length) {
        templateName = availableTemplates[index];
      } else {
        templateName = "default";
      }
    } else {
      templateName = "default";
    }
  }

  ProjectService.init(projectName, targetPath, templateName);

  Logger.info(`🚀 levit-kit v${version}`);
  Logger.info(`✨ Project "${projectName}" initialized with template "${templateName}".`);
  Logger.info("");
  Logger.info("Next steps:");
  Logger.info(`  1. cd ${projectName}`);
  Logger.info("  2. Read README.md for the Human Operator Guide");
  Logger.info("  3. Onboard your AI in .levit/AGENT_ONBOARDING.md");
  if (templateName === "symfony") {
    Logger.info("  4. Run: composer install");
    Logger.info("  5. Configure your .env file");
  }
  Logger.info("");
}

function listAvailableTemplates(): string[] {
  const templatesPath = getTemplatesPath();
  if (!fs.existsSync(templatesPath)) {
    return ["default"];
  }
  
  const entries = fs.readdirSync(templatesPath, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}
