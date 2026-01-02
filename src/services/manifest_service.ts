import fs from "fs-extra";
import path from "node:path";
import { LevitManifest, DEFAULT_MANIFEST, FeatureRef, RoleRef } from "../types/manifest";
import { parseFrontmatter } from "../core/frontmatter";
import { readFileSafe } from "../core/security";

export class ManifestService {
  static read(projectRoot: string): LevitManifest {
    const manifestPath = path.join(projectRoot, "levit.json");
    
    if (!fs.existsSync(manifestPath)) {
      return { ...DEFAULT_MANIFEST };
    }
    
    return fs.readJsonSync(manifestPath);
  }

  static write(projectRoot: string, manifest: LevitManifest): void {
    const manifestPath = path.join(projectRoot, "levit.json");
    fs.writeJsonSync(manifestPath, manifest, { spaces: 2 });
  }

  static sync(projectRoot: string): LevitManifest {
    const manifest = this.read(projectRoot);
    
    // Sync features from filesystem
    manifest.features = this.scanFeatures(projectRoot);
    
    // Sync roles from filesystem
    manifest.roles = this.scanRoles(projectRoot);
    
    this.write(projectRoot, manifest);
    return manifest;
  }

  private static scanFeatures(projectRoot: string): FeatureRef[] {
    const featuresDir = path.join(projectRoot, ".levit", "features");
    
    if (!fs.existsSync(featuresDir)) {
      return [];
    }

    const files = fs.readdirSync(featuresDir)
      .filter(f => f.endsWith(".md") && f !== "README.md" && f !== "INTENT.md");

    return files.map(file => {
      // Validate filename to prevent path traversal
      if (file.includes("..") || file.includes("/") || file.includes("\\")) {
        // Skip invalid filenames
        return null;
      }
      
      const filePath = path.join(featuresDir, file);
      const content = readFileSafe(filePath, projectRoot);
      const frontmatter = this.parseFrontmatter(content);
      
      // Extract ID and slug from filename (e.g., "001-my-feature.md")
      const match = file.match(/^(\d+)-(.+)\.md$/);
      const id = match ? match[1] : "unknown";
      const slug = match ? match[2] : file.replace(".md", "");

      // Extract title from content (# INTENT: Title)
      const titleMatch = content.match(/# INTENT:\s*(.+)/);
      const title = titleMatch ? titleMatch[1].trim() : slug;

      return {
        id,
        slug,
        status: (frontmatter.status as any) || "active",
        title,
        path: `.levit/features/${file}`
      };
    }).filter((f): f is FeatureRef => f !== null);
  }

  private static scanRoles(projectRoot: string): RoleRef[] {
    const rolesDir = path.join(projectRoot, ".levit", "roles");
    
    if (!fs.existsSync(rolesDir)) {
      return [];
    }

    const files = fs.readdirSync(rolesDir)
      .filter(f => f.endsWith(".md") && f !== "README.md");

    const roles: RoleRef[] = [];
    
    for (const file of files) {
      // Validate filename to prevent path traversal
      if (file.includes("..") || file.includes("/") || file.includes("\\")) {
        // Skip invalid filenames
        continue;
      }
      
      const name = file.replace(".md", "");
      const filePath = path.join(rolesDir, file);
      const content = readFileSafe(filePath, projectRoot);
      
      // Try to extract description from first line or heading
      const lines = content.split("\n").filter(l => l.trim());
      const description = lines.length > 0 ? lines[0].replace(/^#\s*/, "") : undefined;

      roles.push({
        name,
        description,
        path: `.levit/roles/${file}`
      });
    }
    
    return roles;
  }

  private static parseFrontmatter(content: string): Record<string, any> {
    try {
      return parseFrontmatter(content);
    } catch (error) {
      // If parsing fails, return empty object to allow graceful degradation
      // The validation service will catch and report the error
      return {};
    }
  }
}
