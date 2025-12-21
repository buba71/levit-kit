import inquirer from "inquirer";

export interface UXSelection {
  presenter: boolean;
  feedback_collector: boolean;
}

export async function askUX(): Promise<UXSelection> {
  const { uxAgents } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "uxAgents",
      message: "Select UX agents:",
      choices: [
        { name: "UX Presenter", value: "presenter" },
        { name: "UX Feedback Collector", value: "feedback_collector" }
      ],
      default: ["presenter"]
    }
  ]);

  return {
    presenter: uxAgents.includes("presenter"),
    feedback_collector: uxAgents.includes("feedback_collector")
  };
}
