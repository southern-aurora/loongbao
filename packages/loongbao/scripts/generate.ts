/* eslint-disable no-console */

import { join } from "node:path";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { exit } from "node:process";
import { generateApp } from "./generate/generate-app";
import { generateDatabase } from "./generate/generate-database";

export async function generate() {
  rmSync(join("generate"), { recursive: true, force: true });
  // Make sure that the existing directories are all present
  existsSync(join("generate")) || mkdirSync(join("generate"));
  existsSync(join("generate", "raw")) || mkdirSync(join("generate", "raw"));
  existsSync(join("generate", "raw", "apps")) || mkdirSync(join("generate", "raw", "apps"));

  await generateApp();
  await generateDatabase();
}

console.log("Loongbao Generating..");

await generate();

console.log("\n✅ Loongbao Generated!");

exit(0);
