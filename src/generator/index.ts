import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import { ProjectConfig } from "../config/types";

export async function generateProject(config: ProjectConfig) {
  const target = path.resolve(process.cwd(), "..", config.projectName);

  // Base directories
  await fs.ensureDir(target);
  await fs.ensureDir(path.join(target, "docs"));

  /**
   * antigravity.yaml
   */
  const antigravityConfig = {
    project: {
      name: config.projectName
    },
    agents: config.agents,
    ux: config.ux,
    quality: config.quality,
    devops: config.devops,
    governance: {
      configuration_guardian: true
    }
  };

  await fs.writeFile(
    path.join(target, "antigravity.yaml"),
    yaml.dump(antigravityConfig, { noRefs: true })
  );

  /**
   * agents.custom.yaml (placeholder)
   */
  await fs.writeFile(
    path.join(target, "agents.custom.yaml"),
    yaml.dump({ agents: {} })
  );

  /**
   * docs/README.md
   */
  const readme = `# ${config.projectName}

This project was initialized using **levit-kit**.

## Agents
${Object.entries(config.agents)
  .filter(([, enabled]) => enabled)
  .map(([name]) => `- ${name}`)
  .join("\n")}

## UX
${Object.entries(config.ux)
  .filter(([, enabled]) => enabled)
  .map(([name]) => `- ${name}`)
  .join("\n")}

## Quality
${Object.entries(config.quality)
  .filter(([, enabled]) => enabled)
  .map(([name]) => `- ${name}`)
  .join("\n")}

## DevOps
${config.devops.enabled ? "- CI/CD enabled" : "- Disabled"}
`;

  await fs.writeFile(
    path.join(target, "docs", "README.md"),
    readme
  );

  /**
   * CI/CD (GitHub Actions)
   */
  if (config.devops.enabled) {
    const workflowDir = path.join(
      target,
      ".github",
      "workflows"
    );

    await fs.ensureDir(workflowDir);

    await fs.copy(
      path.resolve(
        __dirname,
        "../templates/ci/github-actions.yml"
      ),
      path.join(workflowDir, "ci.yml")
    );
  }

  console.log(`\n✅ Project "${config.projectName}" generated successfully.`);
}

