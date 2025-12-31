import fs from "fs-extra";
import path from "node:path";

export type WriteOptions = {
  overwrite: boolean;
};

export function writeTextFile(targetPath: string, content: string, options: WriteOptions) {
  fs.ensureDirSync(path.dirname(targetPath));

  if (fs.existsSync(targetPath) && !options.overwrite) {
    throw new Error(`File already exists: ${targetPath}`);
  }

  fs.writeFileSync(targetPath, content, "utf8");
}
