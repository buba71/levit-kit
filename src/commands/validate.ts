import fs from "fs-extra";
import path from "node:path";
import { requireLevitProjectRoot } from "../core/levit_project";

function hasValidFrontmatter(content: string, type: "feature" | "decision" | "handoff"): { valid: boolean; missing: string[] } {
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

export async function validateCommand(argv: string[], cwd: string) {
  const projectRoot = requireLevitProjectRoot(cwd);

  console.log("🔍 Validating project cognitive scaffolding...");
  let errors = 0;
  let warnings = 0;

  // 1. Check core files
  const coreFiles = [
    "SOCIAL_CONTRACT.md",
    ".levit/AGENT_CONTRACT.md",
    ".levit/AGENT_ONBOARDING.md",
  ];
  for (const file of coreFiles) {
    if (!fs.existsSync(path.join(projectRoot, file))) {
      console.error(`❌ Missing core file: ${file}`);
      errors++;
    } else {
      console.log(`✅ Core file found: ${file}`);
    }
  }

  // 2. Check directories
  const coreDirs = ["features", ".levit/decisions", ".levit/handoff"];
  for (const dir of coreDirs) {
    if (!fs.existsSync(path.join(projectRoot, dir))) {
      console.error(`❌ Missing directory: ${dir}`);
      errors++;
    }
  }

  // 3. Check Features
  const featuresPath = path.join(projectRoot, "features");
  if (fs.existsSync(featuresPath)) {
    const files = fs.readdirSync(featuresPath).filter((f) => f.endsWith(".md") && f !== "README.md");
    if (files.length === 0) {
      console.warn("⚠️ No features found in features/");
      warnings++;
    } else {
      for (const file of files) {
        const content = fs.readFileSync(path.join(featuresPath, file), "utf8");
        const { valid, missing } = hasValidFrontmatter(content, "feature");
        if (!valid) {
          console.error(`❌ Feature ${file} has invalid frontmatter. Missing: ${missing.join(", ")}`);
          errors++;
        }
        if (!content.includes("# INTENT:")) {
          console.error(`❌ Feature ${file} is missing an # INTENT header.`);
          errors++;
        }
      }
    }
  }

  // 4. Check Decisions
  const decisionsPath = path.join(projectRoot, ".levit/decisions");
  if (fs.existsSync(decisionsPath)) {
    const files = fs.readdirSync(decisionsPath).filter((f) => f.endsWith(".md") && f !== "README.md");
    for (const file of files) {
      const content = fs.readFileSync(path.join(decisionsPath, file), "utf8");
      const { valid, missing } = hasValidFrontmatter(content, "decision");
      if (!valid) {
        console.error(`❌ Decision ${file} has invalid frontmatter. Missing: ${missing.join(", ")}`);
        errors++;
      }
    }
  }

  // 5. Check Handoffs
  const handoffsPath = path.join(projectRoot, ".levit/handoff");
  if (fs.existsSync(handoffsPath)) {
    const files = fs.readdirSync(handoffsPath).filter((f) => f.endsWith(".md") && f !== "README.md");
    for (const file of files) {
      const content = fs.readFileSync(path.join(handoffsPath, file), "utf8");
      const { valid, missing } = hasValidFrontmatter(content, "handoff");
      if (!valid) {
        console.error(`❌ Handoff ${file} has invalid frontmatter. Missing: ${missing.join(", ")}`);
        errors++;
      }
    }
  }

  console.log("");
  if (errors > 0) {
    console.error(`❌ Validation failed with ${errors} errors and ${warnings} warnings.`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`✨ Validation passed with ${warnings} warnings.`);
  } else {
    console.log("✨ All cognitive scaffolding checks passed!");
  }
}
