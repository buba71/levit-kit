import { requireLevitProjectRoot } from "../core/levit_project";
import { ValidationService } from "../services/validation_service";
import { Logger } from "../core/logger";
import { LevitError, LevitErrorCode } from "../core/errors";

export async function validateCommand(argv: string[], cwd: string) {
  const projectRoot = requireLevitProjectRoot(cwd);
  
  Logger.info("🔍 Validating project cognitive scaffolding...");
  
  const result = ValidationService.validate(projectRoot);

  for (const issue of result.issues) {
    const text = issue.file ? `${issue.message} (${issue.file})` : issue.message;
    if (issue.type === "error") {
      Logger.error(text);
    } else {
      Logger.warn(text);
    }
  }

  Logger.info("");

  if (!result.valid) {
     throw new LevitError(
       LevitErrorCode.VALIDATION_FAILED, 
       `Validation failed with ${result.metrics.errors} errors.`
     );
  }

  if (result.metrics.warnings > 0) {
    Logger.info(`✨ Validation passed with ${result.metrics.warnings} warnings.`);
  } else {
    Logger.info("✨ All cognitive scaffolding checks passed!");
  }
}
