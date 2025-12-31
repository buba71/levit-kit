import fs from "fs-extra";
import path from "node:path";

export function findLevitProjectRoot(startDir: string): string | null {
  let current = path.resolve(startDir);

  while (true) {
    const marker = path.join(current, ".levit", "AGENT_ONBOARDING.md");
    if (fs.existsSync(marker)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

export function requireLevitProjectRoot(startDir: string): string {
  const root = findLevitProjectRoot(startDir);
  if (!root) {
    throw new Error(
      "Not a levit project (missing .levit/AGENT_ONBOARDING.md). Run this command from a levit-initialized repository."
    );
  }
  return root;
}
