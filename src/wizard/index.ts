import inquirer from "inquirer";
import { normalizeProjectName } from "../utils/normalize";
import { askAgents } from "./agents";
import { askUX } from "./ux";
import { askQuality } from "./quality";
import { askDevOps } from "./devops";
import { confirmSummary } from "./summary";

export async function runWizard() {
  const { rawProjectName } = await inquirer.prompt([
    {
      type: "input",
      name: "rawProjectName",
      message: "Project name:",
      validate: (v: string) => !!v || "Project name required"
    }
  ]);

  const projectName = normalizeProjectName(rawProjectName);
  if (projectName !== rawProjectName) {
    console.log(`ℹ️  Project name normalized to: ${projectName}`);
  }

  const agents = await askAgents();
  const ux = await askUX();
  const quality = await askQuality();
  const devops = await askDevOps();

  const config = {
    projectName,
    agents,
    ux,
    quality,
    devops
  };

  const confirmed = await confirmSummary(config);

  if (!confirmed) {
    console.log("❌ Project generation cancelled.");
    process.exit(0);
  }

  return config;
}

