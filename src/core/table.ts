import Table from "cli-table3";
import { Logger } from "./logger";

export interface TableColumn {
  content: string;
  hAlign?: "left" | "center" | "right";
  vAlign?: "top" | "center" | "bottom";
}

export interface TableRow {
  [key: string]: string | TableColumn;
}

/**
 * Creates a formatted table for CLI output.
 * Automatically handles JSON mode (no table output in JSON mode).
 */
export function createTable(headers: string[]): any {
  return new Table({
    head: headers,
    style: {
      head: ["cyan"],
      border: ["gray"],
    },
    colAligns: headers.map(() => "left" as const),
  });
}

/**
 * Renders a table to the console.
 * In JSON mode, outputs structured data instead of a table.
 */
export function renderTable(table: any, jsonMode: boolean): void {
  if (jsonMode) {
    // In JSON mode, output structured data
    const data = table as any;
    if (data.length > 0) {
      Logger.info(JSON.stringify({ type: "table", data: data }));
    }
  } else {
    // In normal mode, render the table
    console.log(table.toString());
  }
}

/**
 * Creates a simple box/border for previews and summaries.
 */
export function createBox(title: string, content: Record<string, string>): string {
  const lines: string[] = [];
  const maxKeyLength = Math.max(...Object.keys(content).map(k => k.length));
  const maxValueLength = Math.max(...Object.values(content).map(v => v.length));
  const boxWidth = Math.max(title.length + 2, maxKeyLength + maxValueLength + 5);

  // Top border
  lines.push("┌" + "─".repeat(boxWidth) + "┐");
  
  // Title
  lines.push("│ " + title.padEnd(boxWidth - 1) + "│");
  lines.push("├" + "─".repeat(boxWidth) + "┤");
  
  // Content
  for (const [key, value] of Object.entries(content)) {
    const line = `│ ${key.padEnd(maxKeyLength)}: ${value.padEnd(maxValueLength)} │`;
    lines.push(line);
  }
  
  // Bottom border
  lines.push("└" + "─".repeat(boxWidth) + "┘");
  
  return lines.join("\n");
}

