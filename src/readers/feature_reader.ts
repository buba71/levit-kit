import fs from "fs-extra";
import path from "node:path";
import { Feature } from "../types";
import { parseFrontmatter } from "../core/frontmatter";

export class FeatureReader {
  static parse(filePath: string): Feature {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    
    // Parse frontmatter using robust YAML parser
    const frontmatter = parseFrontmatter(content);
    
    // Handle depends_on which can be array or string
    let depends_on: string[] = [];
    if (frontmatter.depends_on) {
      if (Array.isArray(frontmatter.depends_on)) {
        depends_on = frontmatter.depends_on.map((d: any) => String(d).trim());
      } else {
        depends_on = [String(frontmatter.depends_on).trim()];
      }
    }

    return {
      id: String(frontmatter.id || ""),
      status: (frontmatter.status as any) || "active",
      owner: String(frontmatter.owner || ""),
      last_updated: String(frontmatter.last_updated || ""),
      depends_on,
      title: lines.find(l => l.startsWith("# INTENT:"))?.replace("# INTENT:", "").trim() || "",
      vision: "", // Future: parse sections
      success_criteria: [],
      boundaries: [],
      technical_constraints: [],
      agent_task: "",
    };
  }

  static listAll(featuresDir: string): Feature[] {
    if (!fs.existsSync(featuresDir)) return [];
    return fs.readdirSync(featuresDir)
      .filter(f => f.endsWith(".md") && f !== "README.md")
      .map(f => this.parse(path.join(featuresDir, f)));
  }
}
