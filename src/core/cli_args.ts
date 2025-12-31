export type ParsedArgs = {
  positional: string[];
  flags: Record<string, string | boolean>;
};

export function parseArgs(args: string[]): ParsedArgs {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];

    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = args[i + 1];

    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    i += 1;
  }

  return { positional, flags };
}

export function getStringFlag(
  flags: Record<string, string | boolean>,
  key: string
): string | undefined {
  const v = flags[key];
  if (typeof v === "string") {
    return v;
  }
  return undefined;
}

export function getBooleanFlag(
  flags: Record<string, string | boolean>,
  key: string
): boolean {
  return flags[key] === true;
}
