import path from "node:path";
import { writeTextFile } from "../core/write_file";
import { nextSequentialId } from "../core/ids";

export interface CreateFeatureOptions {
  title: string;
  slug: string;
  id?: string;
  overwrite?: boolean;
}

export class FeatureService {
  static createFeature(projectRoot: string, options: CreateFeatureOptions): string {
    const { title, slug, overwrite } = options;
    let { id } = options;

    const baseDir = path.join(projectRoot, "features");
    
    // Auto-generate ID if missing
    if (!id) {
       id = nextSequentialId(baseDir, /^(\d+)-/);
    }
    
    const fileName = `${id}-${slug}.md`;
    const featurePath = path.join(baseDir, fileName);

    const date = new Date().toISOString().split("T")[0];
    
    // Using simple string template for now, but could use a Frontmatter builder
    const frontmatter = `---
id: ${id}
status: active
owner: human
last_updated: ${date}
risk_level: low
depends_on: []
---

`;

    const content = `${frontmatter}# INTENT: ${title}\n\n## 1. Vision (The "Why")\n- **User Story**: [fill]\n- **Priority**: [Low / Medium / High / Critical]\n\n## 2. Success Criteria (The "What")\n- [ ] Criterion 1\n\n## 3. Boundaries (The "No")\n- Non-goal 1\n\n## 4. Technical Constraints\n- [fill]\n\n## 5. Agent Task\n- [fill]\n`;

    writeTextFile(featurePath, content, { overwrite: !!overwrite });
    
    return path.relative(projectRoot, featurePath);
  }
}
