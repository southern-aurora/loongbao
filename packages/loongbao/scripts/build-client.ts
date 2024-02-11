/* eslint-disable no-console */
import { cwd, platform } from "node:process";
import { exec as nodeExec } from "node:child_process";
import { removeDir } from "../util/remove-dir";
import { join } from "node:path";
import { copyFile, mkdir } from "node:fs/promises";

export async function buildClient() {
  console.log("🧊 Client Building..");

  removeDir(join(cwd(), "packages", "client", "dist"));
  removeDir(join(cwd(), "packages", "client", "generate"));
  await mkdir(join(cwd(), "packages", "client", "dist"));
  await mkdir(join(cwd(), "packages", "client", "generate"));

  // Generate the corresponding types for the files in the project and output them to the /packages/client/generate directory.
  await new Promise((resolve) =>
    nodeExec("bun ./node_modules/typescript/bin/tsc --project tsconfig.client-generate.json", (e) => {
      resolve(e);
    })
  );
  await copyFile(join(cwd(), "src", "fail-code.ts"), join(cwd(), "packages", "client", "generate", "src", "fail-code.ts"));

  // Packaging type for the client
  await new Promise((resolve) =>
    nodeExec("cd ./packages/client && bunx tsc", (e) => {
      resolve(e);
    })
  );

  // build /src/client/index.ts to js
  await Bun.build({
    entrypoints: ["./packages/client/index.ts"],
    outdir: "./packages/client"
  });

  const root = join(cwd(), "packages", "client");

  console.log("🧊 If there are no errors, please manual publish:");
  console.log("\x1B[2m");
  console.log("Now, your latest code (including changes to your interface) is built to the latest version and waiting for your release!");

  if (platform !== "win32") {
    console.log("You can publish it to npm by running this commands:");
    console.log("\u001B[0m---");
    console.log(`cd ${join(root)} \\`);
    console.log("  && npm version major \\");
    console.log("  && npm publish --access public \\");
    console.log(`  && cd ${join(cwd())}`);
  } else {
    console.log("You can publish it to npm by running this commands (use \x1B[42mPowerShell\x1B[0m):");
    console.log("\u001B[0m---");
    console.log('$ErrorActionPreference = "Stop";');
    console.log(`Set-Location ${join(root)};`);
    console.log("npm version major;");
    console.log("npm publish --access public;");
    console.log(`Set-Location ${join(cwd())};`);
  }
  console.log("---");
}

await buildClient();
