import inquirer from "inquirer";
import { DEFAULTS } from "../../src/config/defaults";

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
      default: DEFAULTS.quality.tests_required
    },
    {
      type: "confirm",
      name: "code_review_required",
      message: "Require code review?",
      default: DEFAULTS.quality.code_review_required
    },
    {
      type: "confirm",
      name: "human_validation_required",
      message: "Require human validation for critical actions?",
      default: DEFAULTS.quality.human_validation_required
    }
  ]);

  return answers;
}
