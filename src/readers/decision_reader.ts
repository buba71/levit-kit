import fs from "fs-extra";
import path from "node:path";
import { Decision } from "../types";

export class DecisionReader {
  static parse(filePath: string): Decision {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    
    const frontmatterEnd = lines.slice(1).findIndex(l => l.trim() === "---") + 1;
    const frontmatterLines = lines.slice(1, frontmatterEnd);
    
    const getVal = (key: string) => {
      const line = frontmatterLines.find(l => l.startsWith(`${key}:`));
      return line ? line.split(":")[1].trim() : "";
    };

    return {
      id: getVal("id"),
      status: getVal("status") as any || "draft",
      owner: getVal("owner"),
      last_updated: getVal("last_updated"),
      depends_on: getVal("depends_on") ? getVal("depends_on").replace(/[\[\]]/g, "").split(",").map(s => s.trim()) : [],
      title: lines.find(l => l.startsWith("# ADR"))?.split(":")[1]?.trim() || "",
      context: "",
      decision: "",
      rationale: "",
      consequences: "",
    };
  }

  static listAll(decisionsDir: string): Decision[] {
    if (!fs.existsSync(decisionsDir)) return [];
    return fs.readdirSync(decisionsDir)
      .filter(f => f.endsWith(".md") && f !== "README.md")
      .map(f => this.parse(path.join(decisionsDir, f)));
  }
}
