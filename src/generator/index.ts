import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import { ProjectConfig } from "../config/types";

async function readTemplate(relativePath: string): Promise<string> {
  return fs.readFile(
    path.resolve(__dirname, relativePath),
    "utf-8"
  );
}


export async function generateProject(config: ProjectConfig) {
  const target = path.resolve(process.cwd(), "..", config.projectName);

  // Base directories
  await fs.ensureDir(target);
  await fs.ensureDir(path.join(target, "docs"));

  // Generate role-specific documentation
  const rolesDir = path.join(target, "docs", "roles");
  await fs.ensureDir(rolesDir);

  // Generate roles index
  await fs.copy(
    path.resolve(__dirname, "../templates/roles/README.md"),
    path.join(rolesDir, "README.md")
  );

  const rolesReadmePath = path.join(rolesDir, "README.md");

  await fs.copy(
    path.resolve(__dirname, "../templates/roles/README.md"),
    rolesReadmePath
  );

  const enabledRoles: { key: string; label: string }[] = [];

  if (config.agents.qa) {
    enabledRoles.push({ key: "qa", label: "Quality Assurance" });
  }
  
  if (config.agents.security) {
    enabledRoles.push({ key: "security", label: "Security" });
  }
  
  if (config.agents.devops) {
    enabledRoles.push({ key: "devops", label: "DevOps" });
  }
  
  let rolesList = "";
  
  if (enabledRoles.length === 0) {
    rolesList = "_No specific roles enabled._";
  } else {
    rolesList = enabledRoles
      .map(
        (role) => `- [${role.label}](./${role.key}.md)`
      )
      .join("\n");
  }
  
  const readmeContent = await fs.readFile(rolesReadmePath, "utf-8");
  
  await fs.writeFile(
    rolesReadmePath,
    readmeContent.replace("<!-- ROLES_LIST -->", rolesList)
  );


  if (config.agents.qa) {
    await fs.copy(
      path.resolve(__dirname, "../templates/roles/qa.md"),
      path.join(rolesDir, "qa.md")
    );
  }

  if (config.agents.security) {
    await fs.copy(
      path.resolve(__dirname, "../templates/roles/security.md"),
      path.join(rolesDir, "security.md")
    );
  }

  if (config.agents.devops) {
    await fs.copy(
      path.resolve(__dirname, "../templates/roles/devops.md"),
      path.join(rolesDir, "devops.md")
    );
  }

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
  const workflowDir = path.join(target, ".github", "workflows");
  await fs.ensureDir(workflowDir);

  const base = await readTemplate("../templates/ci/base.yml");

  let ciContent = base;

  if (config.quality.tests_required) {
    const tests = await readTemplate("../templates/ci/tests.yml");
    ciContent += "\n" + tests;
  }

  if (config.devops.environments.production) {
    const prod = await readTemplate("../templates/ci/prod.yml");
    ciContent += "\n" + prod;
  }

  await fs.writeFile(
    path.join(workflowDir, "ci.yml"),
    ciContent
  );
}

  console.log(`\n✅ Project "${config.projectName}" generated successfully.`);
}

