export enum LevitErrorCode {
  INVALID_PROJECT_ROOT = "INVALID_PROJECT_ROOT",
  MISSING_DIRECTORY = "MISSING_DIRECTORY",
  MISSING_FILE = "MISSING_FILE",
  INVALID_FRONTMATTER = "INVALID_FRONTMATTER",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  TEMPLATE_NOT_FOUND = "TEMPLATE_NOT_FOUND",
  INIT_FAILED = "INIT_FAILED",
}

export class LevitError extends Error {
  constructor(
    public code: LevitErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "LevitError";
  }
}
