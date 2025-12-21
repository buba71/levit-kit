import inquirer from "inquirer";

export interface QualitySelection {
  tests_required: boolean;
  code_review_required: boolean;
  human_validation_required: boolean;
}

export async function askQuality(): Promise<QualitySelection> {
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "tests_required",
      message: "Require automated tests?",
      default: true
    },
    {
      type: "confirm",
      name: "code_review_required",
      message: "Require code review?",
      default: true
    },
    {
      type: "confirm",
      name: "human_validation_required",
      message: "Require human validation for critical actions?",
      default: true
    }
  ]);

  return answers;
}
