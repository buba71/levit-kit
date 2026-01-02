import fs from "fs-extra";
import path from "node:path";
import { LevitError, LevitErrorCode } from "../core/errors";
import { parseFrontmatter, extractFrontmatterString } from "../core/frontmatter";
import { ManifestService } from "./manifest_service";
import { readFileSafe, validatePath } from "../core/security";

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
      const coreDirs = [".levit/features", ".levit/decisions", ".levit/handoff"];
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
      const featuresPath = path.join(projectRoot, ".levit", "features");
      if (fs.existsSync(featuresPath)) {
        const files = fs.readdirSync(featuresPath).filter((f) => f.endsWith(".md") && f !== "README.md");
        filesScanned += files.length;
        if (files.length === 0) {
            issues.push({
            type: "warning",
            code: "NO_FEATURES",
            message: "No features found in .levit/features/",
            file: ".levit/features/"
          });
        } else {
          for (const file of files) {
            // Validate filename to prevent path traversal
            if (file.includes("..") || file.includes("/") || file.includes("\\")) {
              issues.push({
                type: "error",
                code: LevitErrorCode.VALIDATION_FAILED,
                message: `Invalid filename detected: ${file}`,
                file: path.join("features", file)
              });
              continue;
            }
            
            const filePath = path.join(featuresPath, file);
            const content = readFileSafe(filePath, projectRoot);
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
                file: path.join(".levit", "features", file)
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
          // Validate filename to prevent path traversal
          if (file.includes("..") || file.includes("/") || file.includes("\\")) {
            issues.push({
              type: "error",
              code: LevitErrorCode.VALIDATION_FAILED,
              message: `Invalid filename detected: ${file}`,
              file: path.join(".levit/decisions", file)
            });
            continue;
          }
          
          const filePath = path.join(decisionsPath, file);
          const content = readFileSafe(filePath, projectRoot);
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
          // Validate filename to prevent path traversal
          if (file.includes("..") || file.includes("/") || file.includes("\\")) {
            issues.push({
              type: "error",
              code: LevitErrorCode.VALIDATION_FAILED,
              message: `Invalid filename detected: ${file}`,
              file: path.join(".levit/handoff", file)
            });
            continue;
          }
          
          const filePath = path.join(handoffsPath, file);
          const content = readFileSafe(filePath, projectRoot);
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

      // 6. Validate dependencies
      const dependencyIssues = this.validateDependencies(projectRoot);
      issues.push(...dependencyIssues);

      // 7. Validate constraints
      const constraintIssues = this.validateConstraints(projectRoot);
      issues.push(...constraintIssues);

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

  /**
   * Validates that all dependencies exist and detects circular dependencies.
   */
  private static validateDependencies(projectRoot: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const manifest = ManifestService.read(projectRoot);
    
    // Build a map of feature IDs for quick lookup
    const featureIds = new Set(manifest.features.map(f => f.id));
    const decisionIds = new Set<string>();
    
    // Collect decision IDs
    const decisionsPath = path.join(projectRoot, ".levit/decisions");
    if (fs.existsSync(decisionsPath)) {
      const decisionFiles = fs.readdirSync(decisionsPath)
        .filter(f => f.endsWith(".md") && f !== "README.md");
      
      for (const file of decisionFiles) {
        // Validate filename to prevent path traversal
        if (file.includes("..") || file.includes("/") || file.includes("\\")) {
          continue; // Skip invalid filenames
        }
        
        const filePath = path.join(decisionsPath, file);
        const content = readFileSafe(filePath, projectRoot);
        try {
          const frontmatter = parseFrontmatter(content);
          if (frontmatter.id) {
            decisionIds.add(String(frontmatter.id));
          }
        } catch (error) {
          // Skip invalid frontmatter (already reported by other validation)
        }
      }
    }

    // Validate feature dependencies
    for (const feature of manifest.features) {
      const featurePath = path.join(projectRoot, feature.path);
      if (!fs.existsSync(featurePath)) {
        continue; // Already reported as missing file
      }

      try {
        const content = readFileSafe(featurePath, projectRoot);
        const frontmatter = parseFrontmatter(content);
        const dependsOn = frontmatter.depends_on || [];

        // Handle both array and single value
        const deps = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
        
        for (const dep of deps) {
          const depId = String(dep).trim();
          if (!depId) continue;

          // Check if dependency exists (feature or decision)
          if (!featureIds.has(depId) && !decisionIds.has(depId)) {
            issues.push({
              type: "error",
              code: "INVALID_DEPENDENCY",
              message: `Feature ${feature.id} references non-existent dependency: ${depId}`,
              file: feature.path,
              details: { featureId: feature.id, dependencyId: depId }
            });
          }
        }
      } catch (error) {
        // Skip if frontmatter is invalid (already reported)
      }
    }

    // Detect circular dependencies using DFS
    const cycles = this.detectCycles(projectRoot, featureIds);
    for (const cycle of cycles) {
      issues.push({
        type: "error",
        code: "CIRCULAR_DEPENDENCY",
        message: `Circular dependency detected: ${cycle.join(" → ")} → ${cycle[0]}`,
        file: ".levit/features/",
        details: { cycle }
      });
    }

    return issues;
  }

  /**
   * Detects circular dependencies in features using DFS.
   */
  private static detectCycles(projectRoot: string, featureIds: Set<string>): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const graph = new Map<string, string[]>();

    // Build dependency graph
    for (const featureId of featureIds) {
      const feature = this.findFeatureById(projectRoot, featureId);
      if (!feature) continue;

      const featurePath = path.join(projectRoot, feature.path);
      if (!fs.existsSync(featurePath)) continue;

      try {
        const content = readFileSafe(featurePath, projectRoot);
        const frontmatter = parseFrontmatter(content);
        const dependsOn = frontmatter.depends_on || [];
        const deps = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
        
        // Filter to only feature dependencies (not decisions)
        const featureDeps = deps
          .map(d => String(d).trim())
          .filter(d => featureIds.has(d));
        
        graph.set(featureId, featureDeps);
      } catch (error) {
        // Skip invalid frontmatter
      }
    }

    // DFS to detect cycles
    const dfs = (node: string, path: string[]): void => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          // Cycle detected
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart !== -1) {
            const cycle = path.slice(cycleStart).concat([neighbor]);
            cycles.push(cycle);
          }
        }
      }

      recStack.delete(node);
    };

    // Check all nodes
    for (const node of featureIds) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }

  /**
   * Helper to find a feature by ID from the manifest.
   */
  private static findFeatureById(projectRoot: string, featureId: string): { path: string } | null {
    const manifest = ManifestService.read(projectRoot);
    const feature = manifest.features.find(f => f.id === featureId);
    return feature || null;
  }

  /**
   * Validates project constraints from the manifest.
   */
  private static validateConstraints(projectRoot: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const manifest = ManifestService.read(projectRoot);
    const constraints = manifest.constraints;

    // Validate max_file_size
    if (constraints.max_file_size) {
      const maxSize = constraints.max_file_size;
      const largeFiles = this.findLargeFiles(projectRoot, maxSize);
      for (const file of largeFiles) {
        issues.push({
          type: "error",
          code: "FILE_TOO_LARGE",
          message: `File exceeds max_file_size (${maxSize} bytes): ${file.path} (${file.size} bytes)`,
          file: file.path,
          details: { maxSize, actualSize: file.size }
        });
      }
    }

    // Validate forbidden_patterns
    if (constraints.forbidden_patterns && constraints.forbidden_patterns.length > 0) {
      const forbiddenFiles = this.findForbiddenPatterns(projectRoot, constraints.forbidden_patterns);
      for (const file of forbiddenFiles) {
        issues.push({
          type: "error",
          code: "FORBIDDEN_PATTERN",
          message: `File contains forbidden pattern: ${file.pattern} in ${file.path}`,
          file: file.path,
          details: { pattern: file.pattern }
        });
      }
    }

    // Validate allowed_dependencies (check package.json if it exists)
    if (constraints.allowed_dependencies && constraints.allowed_dependencies.length > 0) {
      const packageJsonPath = path.join(projectRoot, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = fs.readJsonSync(packageJsonPath);
          const allDeps = {
            ...(packageJson.dependencies || {}),
            ...(packageJson.devDependencies || {})
          };
          
          const forbiddenDeps = Object.keys(allDeps).filter(
            dep => !constraints.allowed_dependencies!.includes(dep)
          );
          
          for (const dep of forbiddenDeps) {
            issues.push({
              type: "error",
              code: "FORBIDDEN_DEPENDENCY",
              message: `Dependency "${dep}" is not in allowed_dependencies list`,
              file: "package.json",
              details: { dependency: dep, allowed: constraints.allowed_dependencies }
            });
          }
        } catch (error) {
          // Skip if package.json is invalid
        }
      }
    }

    return issues;
  }

  /**
   * Finds files that exceed the maximum size.
   */
  private static findLargeFiles(projectRoot: string, maxSize: number): Array<{ path: string; size: number }> {
    const largeFiles: Array<{ path: string; size: number }> = [];
    
    const checkDirectory = (dir: string): void => {
      if (!fs.existsSync(dir)) return;
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip node_modules, .git, dist, etc.
        if (entry.name.startsWith(".") && entry.name !== ".levit") continue;
        if (entry.name === "node_modules" || entry.name === "dist") continue;
        
        if (entry.isDirectory()) {
          checkDirectory(fullPath);
        } else if (entry.isFile()) {
          try {
            const stats = fs.statSync(fullPath);
            if (stats.size > maxSize) {
              largeFiles.push({
                path: path.relative(projectRoot, fullPath),
                size: stats.size
              });
            }
          } catch (error) {
            // Skip if file cannot be accessed
          }
        }
      }
    };
    
    checkDirectory(projectRoot);
    return largeFiles;
  }

  /**
   * Finds files containing forbidden patterns.
   */
  private static findForbiddenPatterns(
    projectRoot: string,
    patterns: string[]
  ): Array<{ path: string; pattern: string }> {
    const forbiddenFiles: Array<{ path: string; pattern: string }> = [];
    
    const checkFile = (filePath: string): void => {
      if (!fs.existsSync(filePath)) return;
      
      // Validate path is within project root
      try {
        validatePath(filePath, projectRoot);
      } catch (error) {
        // Skip files outside project root
        return;
      }
      
      try {
        const content = readFileSafe(filePath, projectRoot);
        
        for (const pattern of patterns) {
          // Support both regex and simple string patterns
          let regex: RegExp;
          try {
            regex = new RegExp(pattern);
          } catch (error) {
            // If pattern is not valid regex, treat as literal string
            regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
          }
          
          if (regex.test(content)) {
            forbiddenFiles.push({
              path: path.relative(projectRoot, filePath),
              pattern
            });
            break; // Only report once per file
          }
        }
      } catch (error) {
        // Skip binary files or files that can't be read
      }
    };
    
    const checkDirectory = (dir: string): void => {
      if (!fs.existsSync(dir)) return;
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip node_modules, .git, dist, etc.
        if (entry.name.startsWith(".") && entry.name !== ".levit") continue;
        if (entry.name === "node_modules" || entry.name === "dist") continue;
        
        if (entry.isDirectory()) {
          checkDirectory(fullPath);
        } else if (entry.isFile()) {
          // Only check text files (common extensions)
          const ext = path.extname(entry.name).toLowerCase();
          const textExtensions = [".js", ".ts", ".jsx", ".tsx", ".json", ".md", ".yaml", ".yml", ".txt", ".py", ".rs", ".go"];
          if (textExtensions.includes(ext) || entry.name.endsWith("rc") || entry.name.startsWith(".")) {
            checkFile(fullPath);
          }
        }
      }
    };
    
    checkDirectory(projectRoot);
    return forbiddenFiles;
  }

  private static hasValidFrontmatter(content: string, type: "feature" | "decision" | "handoff"): { valid: boolean; missing: string[] } {
    // First check if frontmatter exists
    const frontmatterString = extractFrontmatterString(content);
    if (frontmatterString === null) {
      return { valid: false, missing: ["Frontmatter block (---)"] };
    }

    // Try to parse frontmatter
    let frontmatter: Record<string, any>;
    try {
      frontmatter = parseFrontmatter(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { valid: false, missing: [`Invalid YAML: ${message}`] };
    }

    // Check required fields
    const required: string[] = ["id", "status", "owner", "last_updated", "risk_level"];
    if (type !== "decision") {
      required.push("depends_on");
    } else {
      required.push("depends_on"); // Decisions also have depends_on for feature ref
    }

    const missing = required.filter((key) => !(key in frontmatter) || frontmatter[key] === undefined || frontmatter[key] === null);
    return { valid: missing.length === 0, missing };
  }
}
