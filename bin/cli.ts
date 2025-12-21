#!/usr/bin/env node

import { run } from "../src/index";

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
