#!/usr/bin/env node

import { run } from "../src/index";
import { validateCommand } from "../src/commands/validate";


run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});


