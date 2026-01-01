import fs from "fs-extra";
import path from "node:path";
import { LevitError, LevitErrorCode } from "../core/errors";

export interface ValidationIssue {
  type: "error" | "warning";
  code: string;
  message: string;
  file?: string;
  details?: any;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  metrics: {
    errors: number;
    warnings: number;
    filesScanned: number;
  };
}

export class ValidationService {
  static validate(projectRoot: string): ValidationResult {
      const issues: ValidationIssue[] = [];
      let filesScanned = 0;

      // 1. Check core files
      const coreFiles = [
        "SOCIAL_CONTRACT.md",
        ".levit/AGENT_CONTRACT.md",
        ".levit/AGENT_ONBOARDING.md",
      ];
      for (const file of coreFiles) {
        if (!fs.existsSync(path.join(projectRoot, file))) {
          issues.push({
            type: "error",
            code: LevitErrorCode.MISSING_FILE,
            message: `Missing core file: ${file}`,
            file
          });
        }
      }

      // 2. Check directories
      const coreDirs = ["features", ".levit/decisions", ".levit/handoff"];
      for (const dir of coreDirs) {
        if (!fs.existsSync(path.join(projectRoot, dir))) {
          issues.push({
            type: "error",
            code: LevitErrorCode.MISSING_DIRECTORY,
            message: `Missing directory: ${dir}`,
            file: dir
          });
        }
      }

      // 3. Check Features
      const featuresPath = path.join(projectRoot, "features");
      if (fs.existsSync(featuresPath)) {
        const files = fs.readdirSync(featuresPath).filter((f) => f.endsWith(".md") && f !== "README.md");
        filesScanned += files.length;
        if (files.length === 0) {
          issues.push({
            type: "warning",
            code: "NO_FEATURES",
            message: "No features found in features/",
            file: "features/"
          });
        } else {
          for (const file of files) {
            const content = fs.readFileSync(path.join(featuresPath, file), "utf8");
            const { valid, missing } = this.hasValidFrontmatter(content, "feature");
            if (!valid) {
              issues.push({
                type: "error",
                code: LevitErrorCode.INVALID_FRONTMATTER,
                message: `Feature ${file} has invalid frontmatter. Missing: ${missing.join(", ")}`,
                file: path.join("features", file)
              });
            }
            if (!content.includes("# INTENT:")) {
              issues.push({
                type: "error",
                code: "INVALID_STRUCTURE",
                message: `Feature ${file} is missing an # INTENT header.`,
                file: path.join("features", file)
              });
            }
          }
        }
      }

      // 4. Check Decisions
      const decisionsPath = path.join(projectRoot, ".levit/decisions");
      if (fs.existsSync(decisionsPath)) {
        const files = fs.readdirSync(decisionsPath).filter((f) => f.endsWith(".md") && f !== "README.md");
        filesScanned += files.length;
        for (const file of files) {
          const content = fs.readFileSync(path.join(decisionsPath, file), "utf8");
          const { valid, missing } = this.hasValidFrontmatter(content, "decision");
          if (!valid) {
            issues.push({
              type: "error",
              code: LevitErrorCode.INVALID_FRONTMATTER,
              message: `Decision ${file} has invalid frontmatter. Missing: ${missing.join(", ")}`,
              file: path.join(".levit/decisions", file)
            });
          }
        }
      }

      // 5. Check Handoffs
      const handoffsPath = path.join(projectRoot, ".levit/handoff");
      if (fs.existsSync(handoffsPath)) {
        const files = fs.readdirSync(handoffsPath).filter((f) => f.endsWith(".md") && f !== "README.md");
        filesScanned += files.length;
        for (const file of files) {
          const content = fs.readFileSync(path.join(handoffsPath, file), "utf8");
          const { valid, missing } = this.hasValidFrontmatter(content, "handoff");
          if (!valid) {
            issues.push({
              type: "error",
              code: LevitErrorCode.INVALID_FRONTMATTER,
              message: `Handoff ${file} has invalid frontmatter. Missing: ${missing.join(", ")}`,
              file: path.join(".levit/handoff", file)
            });
          }
        }
      }

      const errorCount = issues.filter(i => i.type === "error").length;
      const warningCount = issues.filter(i => i.type === "warning").length;

      return {
        valid: errorCount === 0,
        issues,
        metrics: {
          errors: errorCount,
          warnings: warningCount,
          filesScanned
        }
      };
  }

  private static hasValidFrontmatter(content: string, type: "feature" | "decision" | "handoff"): { valid: boolean; missing: string[] } {
    const lines = content.split("\n");
    if (lines[0].trim() !== "---") return { valid: false, missing: ["Opening ---"] };
    const endIndex = lines.slice(1).findIndex((line) => line.trim() === "---");
    if (endIndex === -1) return { valid: false, missing: ["Closing ---"] };

    const frontmatter = lines.slice(1, endIndex + 1).join("\n");
    const required = ["id:", "status:", "owner:", "last_updated:", "risk_level:"];
    if (type !== "decision") {
      required.push("depends_on:");
    } else {
      required.push("depends_on:"); // Decisions also have depends_on for feature ref
    }

    const missing = required.filter((key) => !frontmatter.includes(key));
    return { valid: missing.length === 0, missing };
  }
}
