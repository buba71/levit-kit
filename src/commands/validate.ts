import { requireLevitProjectRoot } from "../core/levit_project";
import { ValidationService } from "../services/validation_service";

export async function validateCommand(argv: string[], cwd: string) {
  const projectRoot = requireLevitProjectRoot(cwd);
  ValidationService.validate(projectRoot);
}
