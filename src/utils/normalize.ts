export function normalizeProjectName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")          // espaces → tirets
    .replace(/[^a-z0-9-]/g, "")    // caractères non sûrs
    .replace(/-+/g, "-");          // éviter --- multiples
}
