import fs from "node:fs";
import path from "node:path";

function getPackageRoot(): string {
  // Use __dirname to reliably locate the package root relative to this file
  // compiled file is in dist/src/init.js, so we go up two levels to reach package root
  return path.resolve(__dirname, "..", "..");
}

export function initProject(projectName: string, targetPath: string) {
  const packageRoot = getPackageRoot();
  const templatePath = path.join(packageRoot, "templates", "default");

  if (!projectName) {
    throw new Error("Project name is required.");
  }

  if (fs.existsSync(targetPath)) {
    throw new Error(`Directory "${projectName}" already exists.`);
  }

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Default template not found at ${templatePath}`
    );
  }

  fs.mkdirSync(targetPath, { recursive: true });
  copyDirectory(templatePath, targetPath);

  console.log("");
  console.log("levit-kit v1.0");
  console.log("");
  console.log("✔ Project directory created");
  console.log("✔ Template copied");
  console.log("");
  console.log(`Project "${projectName}" initialized successfully.`);
  console.log("");
  console.log("Next steps:");
  console.log("  - Open the project");
  console.log("  - Read SOCIAL_CONTRACT.md");
  console.log("  - Start defining features");
}

function copyDirectory(source: string, target: string) {
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
