import inquirer from "inquirer";
import { DEFAULTS } from "../../src/config/defaults";




export interface UXSelection {
  presenter: boolean;
  feedback_collector: boolean;
}

export async function askUX(): Promise<UXSelection> {
  
  const defaultUX = Object.entries(DEFAULTS.ux)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);

  const { uxAgents } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "uxAgents",
      message: "Select UX agents:",
      choices: [
        { name: "UX Presenter", value: "presenter" },
        { name: "UX Feedback Collector", value: "feedback_collector" }
      ],
      default: defaultUX
    }
  ]);

  return {
    presenter: uxAgents.includes("presenter"),
    feedback_collector: uxAgents.includes("feedback_collector")
  };
}
