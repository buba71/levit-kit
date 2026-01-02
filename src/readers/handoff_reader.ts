import fs from "fs-extra";
import path from "node:path";
import { Handoff } from "../types";
import { parseFrontmatter } from "../core/frontmatter";

export class HandoffReader {
  static parse(filePath: string): Handoff {
    const content = fs.readFileSync(filePath, "utf8");
    
    // Parse frontmatter using robust YAML parser
    const frontmatter = parseFrontmatter(content);
    
    // Handle depends_on which can be array or string
    let depends_on: string[] = [];
    let feature_ref = "";
    if (frontmatter.depends_on) {
      if (Array.isArray(frontmatter.depends_on)) {
        depends_on = frontmatter.depends_on.map((d: any) => String(d).trim());
        feature_ref = depends_on[0] || "";
      } else {
        const dep = String(frontmatter.depends_on).trim();
        depends_on = [dep];
        feature_ref = dep;
      }
    }

    return {
      status: (frontmatter.status as any) || "active",
      owner: String(frontmatter.owner || ""),
      last_updated: String(frontmatter.last_updated || ""),
      depends_on,
      role: String(frontmatter.owner || ""), // In handoffs, owner is usually the role
      feature_ref,
      deliverables: [],
    };
  }

  static listAll(handoffsDir: string): Handoff[] {
    if (!fs.existsSync(handoffsDir)) return [];
    return fs.readdirSync(handoffsDir)
      .filter(f => f.endsWith(".md") && f !== "README.md")
      .map(f => this.parse(path.join(handoffsDir, f)));
  }
}
