import inquirer from "inquirer";
import { DEFAULTS } from "../config/defaults";

export interface DevOpsSelection {
  enabled: boolean;
  environments: {
    staging: boolean;
    production: boolean;
  };
  require_human_approval_for_prod: boolean;
}

export async function askDevOps(): Promise<DevOpsSelection> {
  const { enabled } = await inquirer.prompt([
    {
      type: "confirm",
      name: "enabled",
      message: "Enable CI/CD (DevOps agent)?",
      default: DEFAULTS.devops.enabled
    }
  ]);

  if (!enabled) {
    return {
      enabled: false,
      environments: {
        staging: false,
        production: false
      },
      require_human_approval_for_prod: DEFAULTS.devops.require_human_approval_for_prod
    };
  }

  const defaultEnvs = Object.entries(DEFAULTS.devops.environments)
    .filter(([, enabled]) => enabled)
    .map(([env]) => env);

  const { environments } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "environments",
      message: "Select deployment environments:",
      choices: [
        { name: "Staging", value: "staging" },
        { name: "Production", value: "production" }
      ],
      default: defaultEnvs // évite l’état vide
    }
  ]);

  const { require_human_approval_for_prod } = await inquirer.prompt([
    {
      type: "confirm",
      name: "require_human_approval_for_prod",
      message: "Require human approval before production deploy?",
      default: DEFAULTS.devops.require_human_approval_for_prod
    }
  ]);

  return {
    enabled: true,
    environments: {
      staging: environments.includes("staging"),
      production: environments.includes("production")
    },
    require_human_approval_for_prod
  };
}
