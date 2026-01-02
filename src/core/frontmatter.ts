import yaml from "js-yaml";
import { LevitError, LevitErrorCode } from "./errors";

/**
 * Extracts and parses YAML frontmatter from markdown content.
 * 
 * @param content - Full markdown content with frontmatter
 * @returns Parsed frontmatter object, or empty object if no frontmatter found
 * @throws LevitError if frontmatter is malformed
 */
export function parseFrontmatter(content: string): Record<string, any> {
  const lines = content.split("\n");
  
  // Check for opening frontmatter delimiter
  if (lines[0].trim() !== "---") {
    return {};
  }
  
  // Find closing delimiter
  const endIndex = lines.slice(1).findIndex((line) => line.trim() === "---");
  if (endIndex === -1) {
    // Opening delimiter found but no closing one - this is an error
    throw new LevitError(
      LevitErrorCode.INVALID_FRONTMATTER,
      "Frontmatter is missing closing delimiter (---)"
    );
  }
  
  // Extract frontmatter content (between the delimiters)
  const frontmatterContent = lines.slice(1, endIndex + 1).join("\n");
  
  // Parse YAML
  try {
    const parsed = yaml.load(frontmatterContent);
    
    // yaml.load can return null, undefined, or a primitive
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }
    
    return parsed as Record<string, any>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown YAML parsing error";
    throw new LevitError(
      LevitErrorCode.INVALID_FRONTMATTER,
      `Failed to parse frontmatter YAML: ${message}`,
      { originalError: message }
    );
  }
}

/**
 * Extracts frontmatter content as a string (without parsing).
 * Useful for validation that doesn't require parsing.
 * 
 * @param content - Full markdown content with frontmatter
 * @returns Frontmatter content string, or null if no frontmatter found
 */
export function extractFrontmatterString(content: string): string | null {
  const lines = content.split("\n");
  
  if (lines[0].trim() !== "---") {
    return null;
  }
  
  const endIndex = lines.slice(1).findIndex((line) => line.trim() === "---");
  if (endIndex === -1) {
    return null;
  }
  
  return lines.slice(1, endIndex + 1).join("\n");
}


