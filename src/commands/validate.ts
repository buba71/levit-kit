import chalk from "chalk";
import { requireLevitProjectRoot } from "../core/levit_project";
import { ValidationService } from "../services/validation_service";
import { Logger } from "../core/logger";
import { LevitError, LevitErrorCode } from "../core/errors";
import { createTable, renderTable } from "../core/table";

export async function validateCommand(argv: string[], cwd: string) {
  const projectRoot = requireLevitProjectRoot(cwd);
  const isJsonMode = Logger.getJsonMode();
  
  if (!isJsonMode) {
    Logger.info("🔍 Validating project cognitive scaffolding...");
    Logger.info("");
  }
  
  const result = ValidationService.validate(projectRoot);

  // Separate errors and warnings
  const errors = result.issues.filter(i => i.type === "error");
  const warnings = result.issues.filter(i => i.type === "warning");

  // Display errors in a table
  if (errors.length > 0) {
    const errorTable = createTable(["Type", "Code", "Message", "File"]);
    
    for (const issue of errors) {
      const typeDisplay = isJsonMode ? "error" : chalk.red("✗ error");
      (errorTable as any).push([
        typeDisplay,
        issue.code || "",
        issue.message,
        issue.file || ""
      ]);
    }
    
    if (!isJsonMode) {
      Logger.error(chalk.bold.red("Errors:"));
    }
    renderTable(errorTable, isJsonMode);
    if (!isJsonMode) {
      Logger.info("");
    }
  }

  // Display warnings in a table
  if (warnings.length > 0) {
    const warningTable = createTable(["Type", "Code", "Message", "File"]);
    
    for (const issue of warnings) {
      const typeDisplay = isJsonMode ? "warning" : chalk.yellow("⚠ warning");
      (warningTable as any).push([
        typeDisplay,
        issue.code || "",
        issue.message,
        issue.file || ""
      ]);
    }
    
    if (!isJsonMode) {
      Logger.warn(chalk.bold.yellow("Warnings:"));
    }
    renderTable(warningTable, isJsonMode);
    if (!isJsonMode) {
      Logger.info("");
    }
  }

  // Summary
  if (!isJsonMode) {
    Logger.info("");
  }

  if (!result.valid) {
    const summary = `Validation failed: ${chalk.red(result.metrics.errors.toString())} error(s)`;
    if (result.metrics.warnings > 0) {
      Logger.error(`${summary}, ${chalk.yellow(result.metrics.warnings.toString())} warning(s)`);
    } else {
      Logger.error(summary);
    }
    throw new LevitError(
      LevitErrorCode.VALIDATION_FAILED, 
      `Validation failed with ${result.metrics.errors} errors.`
    );
  }

  if (result.metrics.warnings > 0) {
    Logger.success(`Validation passed with ${chalk.yellow(result.metrics.warnings.toString())} warning(s).`);
  } else {
    Logger.success("All cognitive scaffolding checks passed!");
  }
}
