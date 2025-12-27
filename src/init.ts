import fs from "fs-extra";
import path from "node:path";

function getPackageRoot(): string {
  // Use __dirname to reliably locate the package root relative to this file
  // compiled file is in dist/src/init.js, so we go up two levels to reach package root
  return path.resolve(__dirname, "..", "..");
}

function getVersion(): string {
  try {
    const packageJson = fs.readJsonSync(path.join(getPackageRoot(), "package.json"));
    return packageJson.version;
  } catch {
    return "0.0.0";
  }
}

export function initProject(projectName: string, targetPath: string) {
  const packageRoot = getPackageRoot();
  const templatePath = path.join(packageRoot, "templates", "default");
  const version = getVersion();

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

  fs.ensureDirSync(targetPath);
  fs.copySync(templatePath, targetPath);

  console.log("");
  console.log(`🚀 levit-kit v${version}`);
  console.log("");
  console.log("  ✔ Project directory created");
  console.log("  ✔ Template copied");
  console.log("");
  console.log(`✨ Project "${projectName}" initialized successfully.`);
  console.log("");
  console.log("Next steps:");
  console.log(`  - cd ${projectName}`);
  console.log("  - Read SOCIAL_CONTRACT.md");
  console.log("  - Start defining features");
  console.log("");
}
