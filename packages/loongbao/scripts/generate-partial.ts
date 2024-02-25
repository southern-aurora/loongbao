/* eslint-disable no-console, @typescript-eslint/no-explicit-any */

import { argv, exit } from "node:process";
import { generateApp } from "./generate/generate-app";
import { generateDatabase } from "./generate/generate-database";

console.log("Loongbao Quick Generating..");

export async function generatePartial(path?: string) {
  await generateApp();
  await generateDatabase();
}

await generatePartial(...(argv.slice(3) as any));

console.log("\n✅ Loongbao Generated!");

exit(0);
