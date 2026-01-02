import path from "node:path";
import fs from "fs-extra";
import yaml from "js-yaml";
import { writeTextFile } from "../core/write_file";
import { nextSequentialId } from "../core/ids";
import { ManifestService } from "./manifest_service";
import { parseFrontmatter } from "../core/frontmatter";
import { FeatureRef } from "../types/manifest";
import { LevitError, LevitErrorCode } from "../core/errors";

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
    
    // Auto-sync manifest after feature creation
    ManifestService.sync(projectRoot);
    
    return path.relative(projectRoot, featurePath);
  }

  /**
   * Lists all features from the manifest.
   */
  static listFeatures(projectRoot: string): FeatureRef[] {
    const manifest = ManifestService.read(projectRoot);
    return manifest.features;
  }

  /**
   * Updates the status of a feature.
   */
  static updateFeatureStatus(
    projectRoot: string,
    featureId: string,
    newStatus: 'active' | 'draft' | 'deprecated' | 'completed'
  ): void {
    const manifest = ManifestService.read(projectRoot);
    const feature = manifest.features.find(f => f.id === featureId);

    if (!feature) {
      throw new LevitError(
        LevitErrorCode.VALIDATION_FAILED,
        `Feature with ID "${featureId}" not found`
      );
    }

    // Update the feature file
    const featurePath = path.join(projectRoot, feature.path);
    if (!fs.existsSync(featurePath)) {
      throw new LevitError(
        LevitErrorCode.MISSING_FILE,
        `Feature file not found: ${feature.path}`
      );
    }

    const content = fs.readFileSync(featurePath, "utf-8");
    const lines = content.split("\n");
    
    // Find frontmatter section
    const frontmatterStart = lines.findIndex(l => l.trim() === "---");
    if (frontmatterStart === -1) {
      throw new LevitError(
        LevitErrorCode.INVALID_FRONTMATTER,
        `Feature file ${feature.path} has no frontmatter`
      );
    }

    const frontmatterEnd = lines.slice(frontmatterStart + 1).findIndex(l => l.trim() === "---");
    if (frontmatterEnd === -1) {
      throw new LevitError(
        LevitErrorCode.INVALID_FRONTMATTER,
        `Feature file ${feature.path} has invalid frontmatter`
      );
    }

    // Parse and update frontmatter
    const frontmatter = parseFrontmatter(content);
    frontmatter.status = newStatus;
    frontmatter.last_updated = new Date().toISOString().split("T")[0];

    // Rebuild frontmatter as YAML
    const frontmatterYaml = yaml.dump(frontmatter, { lineWidth: -1, noRefs: true });
    
    // Reconstruct file
    const newContent = `---\n${frontmatterYaml}---\n\n${lines.slice(frontmatterStart + frontmatterEnd + 2).join("\n")}`;
    fs.writeFileSync(featurePath, newContent, "utf-8");

    // Sync manifest
    ManifestService.sync(projectRoot);
  }
}
