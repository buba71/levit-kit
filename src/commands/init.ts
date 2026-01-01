import { Logger } from "../core/logger";
import { getVersion } from "../core/version";
import { ProjectService } from "../services/project_service";

export function initProject(projectName: string, targetPath: string) {
  const version = getVersion();

  if (!projectName) {
    throw new Error("Project name is required.");
  }

  // Ensure project name is valid for a directory
  if (!/^[a-z0-9-_]+$/i.test(projectName)) {
    throw new Error("Invalid project name. Use only letters, numbers, dashes, and underscores.");
  }

  ProjectService.init(projectName, targetPath);

  Logger.info(`🚀 levit-kit v${version}`);
  Logger.info(`✨ Project "${projectName}" is ready for development.`);
  Logger.info("");
  Logger.info("Next steps:");
  Logger.info(`  1. cd ${projectName}`);
  Logger.info("  2. Read README.md for the Human Operator Guide");
  Logger.info("  3. Onboard your AI in .levit/AGENT_ONBOARDING.md");
  Logger.info("");
}
