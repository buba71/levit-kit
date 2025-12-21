import { runWizard } from "./wizard";
import { validateConfig } from "./config/validator";
import { generateProject } from "./generator";

export async function run() {
  console.log("🚀 Create Antigravity Project\n");

  const projectConfig = await runWizard();

  validateConfig(projectConfig);

  await generateProject(projectConfig);

  console.log("\n✅ Project initialized successfully");
}
