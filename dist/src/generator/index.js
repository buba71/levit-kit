"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProject = generateProject;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
async function readTemplate(relativePath) {
    return fs_extra_1.default.readFile(path_1.default.resolve(__dirname, relativePath), "utf-8");
}
async function generateProject(config) {
    const target = path_1.default.resolve(process.cwd(), "..", config.projectName);
    // Base directories
    await fs_extra_1.default.ensureDir(target);
    await fs_extra_1.default.ensureDir(path_1.default.join(target, "docs"));
    // Generate role-specific documentation
    const rolesDir = path_1.default.join(target, "docs", "roles");
    await fs_extra_1.default.ensureDir(rolesDir);
    // Generate roles index
    await fs_extra_1.default.copy(path_1.default.resolve(__dirname, "../templates/roles/README.md"), path_1.default.join(rolesDir, "README.md"));
    const rolesReadmePath = path_1.default.join(rolesDir, "README.md");
    await fs_extra_1.default.copy(path_1.default.resolve(__dirname, "../templates/roles/README.md"), rolesReadmePath);
    const enabledRoles = [];
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
    }
    else {
        rolesList = enabledRoles
            .map((role) => `- [${role.label}](./${role.key}.md)`)
            .join("\n");
    }
    const readmeContent = await fs_extra_1.default.readFile(rolesReadmePath, "utf-8");
    await fs_extra_1.default.writeFile(rolesReadmePath, readmeContent.replace("<!-- ROLES_LIST -->", rolesList));
    if (config.agents.qa) {
        await fs_extra_1.default.copy(path_1.default.resolve(__dirname, "../templates/roles/qa.md"), path_1.default.join(rolesDir, "qa.md"));
    }
    if (config.agents.security) {
        await fs_extra_1.default.copy(path_1.default.resolve(__dirname, "../templates/roles/security.md"), path_1.default.join(rolesDir, "security.md"));
    }
    if (config.agents.devops) {
        await fs_extra_1.default.copy(path_1.default.resolve(__dirname, "../templates/roles/devops.md"), path_1.default.join(rolesDir, "devops.md"));
    }
    /**
     * antigravity.yaml
     */
    const sections = [
        {
            project: {
                name: config.projectName
            }
        },
        { agents: config.agents },
        { ux: config.ux },
        { quality: config.quality },
        { devops: config.devops },
        {
            governance: {
                configuration_guardian: true
            }
        }
    ];
    const yamlContent = sections
        .map((section) => js_yaml_1.default.dump(section, { noRefs: true }).trim())
        .join("\n\n");
    await fs_extra_1.default.writeFile(path_1.default.join(target, "antigravity.yaml"), yamlContent + "\n");
    /**
     * agents.custom.yaml (placeholder)
     */
    await fs_extra_1.default.writeFile(path_1.default.join(target, "agents.custom.yaml"), js_yaml_1.default.dump({ agents: {} }));
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
    await fs_extra_1.default.writeFile(path_1.default.join(target, "docs", "README.md"), readme);
    /**
     * CI/CD (GitHub Actions)
     */
    if (config.devops.enabled) {
        const workflowDir = path_1.default.join(target, ".github", "workflows");
        await fs_extra_1.default.ensureDir(workflowDir);
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
        await fs_extra_1.default.writeFile(path_1.default.join(workflowDir, "ci.yml"), ciContent);
    }
    console.log(`\n✅ Project "${config.projectName}" generated successfully.`);
}
