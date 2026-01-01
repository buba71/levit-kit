import fs from "fs-extra";
import path from "node:path";
import { Handoff } from "../types";

export class HandoffReader {
  static parse(filePath: string): Handoff {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    
    const frontmatterEnd = lines.slice(1).findIndex(l => l.trim() === "---") + 1;
    const frontmatterLines = lines.slice(1, frontmatterEnd);
    
    const getVal = (key: string) => {
      const line = frontmatterLines.find(l => l.startsWith(`${key}:`));
      return line ? line.split(":")[1].trim() : "";
    };

    return {
      status: getVal("status") as any || "active",
      owner: getVal("owner"),
      last_updated: getVal("last_updated"),
      depends_on: getVal("depends_on") ? getVal("depends_on").replace(/[\[\]]/g, "").split(",").map(s => s.trim()) : [],
      role: getVal("owner"), // In handoffs, owner is usually the role
      feature_ref: getVal("depends_on")?.replace(/[\[\]]/g, "") || "",
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
