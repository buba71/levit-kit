import fs from "fs-extra";
import path from "node:path";
import { getTemplatePath } from "../core/paths";
import { getVersion } from "../core/version";
import { generateProject } from "../init";

/**
 * Initializes a new project by copying the default template.
 * 
 * @param projectName The name of the project to create
 * @param targetPath The absolute path where the project should be created
 */
export function initProject(projectName: string, targetPath: string) {
  const templatePath = getTemplatePath("default");
  const version = getVersion();

  if (!projectName) {
    throw new Error("Project name is required.");
  }

  // Ensure project name is valid for a directory
  if (!/^[a-z0-9-_]+$/i.test(projectName)) {
    throw new Error("Invalid project name. Use only letters, numbers, dashes, and underscores.");
  }

  if (fs.existsSync(targetPath)) {
    throw new Error(`Directory "${projectName}" already exists.`);
  }

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Default template not found at ${templatePath}`);
  }

  try {
    generateProject(targetPath, "default");

    console.log("");
    console.log(`🚀 levit-kit v${version}`);
    console.log("");
    console.log("  ✔ Structure initialized");
    console.log("  ✔ Conventions applied");
    console.log("");
    console.log(`✨ Project "${projectName}" is ready for development.`);
    console.log("");
    console.log("Next steps:");
    console.log(`  1. cd ${projectName}`);
    console.log("  2. Review SOCIAL_CONTRACT.md to understand the foundations");
    console.log("  3. Define your first feature in features/README.md");
    console.log("");
  } catch (error) {
    // Attempt clean up if directory was created but copy failed
    if (fs.existsSync(targetPath) && fs.readdirSync(targetPath).length === 0) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }
    throw error;
  }
}
