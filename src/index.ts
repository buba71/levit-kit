import { runWizard } from "./wizard";
import { validateConfig } from "./config/validator";
import { generateProject } from "./generator";
import { validateCommand } from "./commands/validate";

async function initCommand() {
  console.log("🚀 Create Antigravity Project\n");

  const projectConfig = await runWizard();

  validateConfig(projectConfig);

  await generateProject(projectConfig);

  console.log("\n✅ Project initialized successfully");
}

export async function run() {
  const command = process.argv[2];

  switch (command) {
    case "validate":
      await validateCommand(process.argv[3]);
      break;

    case "init":
    default:
      await initCommand();
      break;
  }
}

