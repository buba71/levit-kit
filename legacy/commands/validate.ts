import fs from "fs-extra";
import yaml from "js-yaml";
import path from "path";
import { AntigravitySchema } from "../../src/schema/antigravity.schema";

export async function validateCommand(
  filePath: string = "antigravity.yaml"
) {
  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!(await fs.pathExists(absolutePath))) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const raw = await fs.readFile(absolutePath, "utf-8");
  const parsed = yaml.load(raw);

  const result = AntigravitySchema.safeParse(parsed);

  if (!result.success) {
    console.error("❌ Invalid antigravity.yaml");
    console.error(result.error.format());
    process.exit(1);
  }

  console.log("✅ antigravity.yaml is valid");
}

