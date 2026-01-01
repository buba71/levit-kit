import fs from "fs-extra";
import path from "node:path";
import { Feature } from "../types";

export class FeatureReader {
  static parse(filePath: string): Feature {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    
    // Basic frontmatter parsing (very simple implementation for now)
    const frontmatterEnd = lines.slice(1).findIndex(l => l.trim() === "---") + 1;
    const frontmatterLines = lines.slice(1, frontmatterEnd);
    
    const getVal = (key: string) => {
      const line = frontmatterLines.find(l => l.startsWith(`${key}:`));
      return line ? line.split(":")[1].trim() : "";
    };

    return {
      id: getVal("id"),
      status: getVal("status") as any || "active",
      owner: getVal("owner"),
      last_updated: getVal("last_updated"),
      depends_on: getVal("depends_on") ? getVal("depends_on").replace(/[\[\]]/g, "").split(",").map(s => s.trim()) : [],
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
