/* eslint-disable no-console */

import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { exit } from "node:process";
import { generateDatabase } from "./generate/generate-database";

export async function generate() {
  // Make sure that the existing directories are all present
  existsSync(join("generate")) || mkdirSync(join("generate"));
  existsSync(join("generate", "raw")) || mkdirSync(join("generate", "raw"));
  existsSync(join("generate", "raw", "apps")) || mkdirSync(join("generate", "raw", "apps"));

  await generateDatabase();
}

console.log("Loongbao Database Generating..");

await generate();

console.log("\n✅ Loongbao Database Generated!");

exit(0);
