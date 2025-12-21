import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import { ProjectConfig } from "../config/types";

export async function generateProject(config: ProjectConfig) {
  const target = path.resolve(process.cwd(), "..", config.projectName);

  await fs.ensureDir(target);
  await fs.ensureDir(path.join(target, "docs"));

  // 1. antigravity.yaml
  const antigravityConfig = {
    project: {
      name: config.projectName,
      initiative: "greenfield"
    },
    agents: config.agents,
    ux: config.ux,
    governance: {
      decision_logging: true
    },
    quality: config.quality,
    devops: config.devops,
    configuration_guardian: {
      enabled: true
    }
  };

  await fs.writeFile(
    path.join(target, "antigravity.yaml"),
    yaml.dump(antigravityConfig)
  );

  // 2. agents.custom.yaml
  await fs.writeFile(
    path.join(target, "agents.custom.yaml"),
    yaml.dump({ agents: {} })
  );

  // 3. docs/README.md
  const readme = `# ${config.projectName}

This project was initialized using **Antigravity**.

## Enabled agents
${Object.entries(config.agents)
  .filter(([, enabled]) => enabled)
  .map(([name]) => `- ${name}`)
  .join("\n")}

## UX
${Object.entries(config.ux)
  .filter(([, enabled]) => enabled)
  .map(([name]) => `- ${name}`)
  .join("\n")}

## Governance
- Decision logging enabled
- Configuration Guardian enabled
`;

  await fs.writeFile(
    path.join(target, "docs", "README.md"),
    readme
  );
}

