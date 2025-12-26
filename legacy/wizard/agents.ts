import inquirer from "inquirer";
import { DEFAULTS } from "../../src/config/defaults";

export interface AgentsSelection {
  product_owner: boolean;
  developer: true;
  code_reviewer: boolean;
  qa: boolean;
  security: boolean;
  devops: boolean;
}

export async function askAgents(): Promise<AgentsSelection> {
  
  const defaultAgents = Object.entries(DEFAULTS.agents)
    .filter(([, enabled]) => enabled)
    .map(([agent]) => agent);

  const { selectedAgents } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedAgents",
      message: "Select the agents to enable:",
      choices: [
        { name: "Product Owner", value: "product_owner" },
        { name: "Code Reviewer", value: "code_reviewer" },
        { name: "QA", value: "qa" },
        { name: "Security", value: "security" },
        { name: "DevOps (CI/CD)", value: "devops" }
      ],
      default: defaultAgents
    }
  ]);

  return {
    product_owner: selectedAgents.includes("product_owner"),
    developer: true, // toujours actif
    code_reviewer: selectedAgents.includes("code_reviewer"),
    qa: selectedAgents.includes("qa"),
    security: selectedAgents.includes("security"),
    devops: selectedAgents.includes("devops")
  };
}
