import chalk from "chalk";
import { LevitError, LevitErrorCode } from "./errors";
import { Logger } from "./logger";

/**
 * Maps error codes to helpful suggestions.
 */
const ERROR_SUGGESTIONS: Record<LevitErrorCode, string[]> = {
  [LevitErrorCode.INVALID_PROJECT_ROOT]: [
    "Make sure you're in a levit project directory (contains .levit/ folder)",
    "Initialize a new project: levit init <project-name>",
  ],
  [LevitErrorCode.MISSING_DIRECTORY]: [
    "Check that the required directory exists",
    "Run: levit validate to check project structure",
  ],
  [LevitErrorCode.MISSING_FILE]: [
    "Check that the file exists at the specified path",
    "List available files: levit feature list",
  ],
  [LevitErrorCode.INVALID_FRONTMATTER]: [
    "Check the YAML frontmatter syntax in the file",
    "Ensure frontmatter is between --- markers",
    "Validate the file: levit validate",
  ],
  [LevitErrorCode.VALIDATION_FAILED]: [
    "Run: levit validate to see all validation issues",
    "Check the project structure in .levit/",
  ],
  [LevitErrorCode.TEMPLATE_NOT_FOUND]: [
    "Available templates: default, symfony",
    "Usage: levit init <project-name> [template]",
  ],
  [LevitErrorCode.INIT_FAILED]: [
    "Check that the target directory is empty or doesn't exist",
    "Ensure you have write permissions",
  ],
  [LevitErrorCode.INVALID_COMMAND]: [
    "Run: levit --help to see available commands",
    "Check command syntax in the documentation",
  ],
  [LevitErrorCode.MISSING_REQUIRED_ARG]: [
    "Check the command usage with: levit --help",
    "Required arguments must be provided",
  ],
  [LevitErrorCode.INVALID_PROJECT_NAME]: [
    "Use only letters, numbers, dashes, and underscores",
    "Example: my-project, api_v2, service-1",
  ],
};

/**
 * Displays a formatted error message with suggestions.
 */
export function displayError(error: LevitError): void {
  const isJsonMode = Logger.getJsonMode();

  if (isJsonMode) {
    // In JSON mode, output structured error
    Logger.error(JSON.stringify({
      error: {
        code: error.code,
        message: error.message,
        suggestions: ERROR_SUGGESTIONS[error.code] || [],
        details: error.details,
      },
    }));
    return;
  }

  // Display error header
  Logger.error(chalk.bold.red(`Error: ${error.message}`));
  
  // Display error code
  Logger.info(chalk.gray(`Code: ${error.code}`));
  Logger.info("");

  // Display suggestions
  const suggestions = ERROR_SUGGESTIONS[error.code];
  if (suggestions && suggestions.length > 0) {
    Logger.info(chalk.bold("💡 Suggestions:"));
    for (const suggestion of suggestions) {
      Logger.info(chalk.gray(`  • ${suggestion}`));
    }
    Logger.info("");
  }

  // Display details if available
  if (error.details) {
    Logger.info(chalk.gray("Details:"));
    Logger.info(chalk.gray(JSON.stringify(error.details, null, 2)));
    Logger.info("");
  }
}

