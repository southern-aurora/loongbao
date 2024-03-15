import { argv, cwd, env, exit } from "node:process";
import { join } from "node:path";
import { $ } from "bun";
import { readFile } from "node:fs/promises";

console.log("👋 Hello World!");

const packageJson = await JSON.parse((await readFile(join(__dirname, "package.json"))).toString());

await $`${{ raw: "bun run ./index.ts" }}`.env({
  ...env,
  hello: "world",
  LOONGBAO_RUN_MODE: "API_TEST",
  LOONGBAO_TEST: undefined ?? "1"
});
