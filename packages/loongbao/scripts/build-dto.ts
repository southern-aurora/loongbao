/* eslint-disable no-console */
import { cwd, platform } from "node:process";
import { exec as nodeExec } from "node:child_process";
import { removeDir } from "../utils/remove-dir";
import { join } from "node:path";
import { copyFile, mkdir } from "node:fs/promises";

export async function buildDTO() {
  console.log("🧊 Loongbao DTO Building..");

  removeDir(join(cwd(), "packages", "dto", "dist"));
  removeDir(join(cwd(), "packages", "dto", "generate"));
  await mkdir(join(cwd(), "packages", "dto", "dist"));
  await mkdir(join(cwd(), "packages", "dto", "generate"));

  // Generate the corresponding types for the files in the project and output them to the /packages/dto/generate directory.
  await new Promise((resolve) =>
    nodeExec("bun ./node_modules/typescript/bin/tsc --project tsconfig.build-dto.json", (e, stdout) => {
      resolve(e);
    })
  );
  await copyFile(join(cwd(), "src", "fail-code.ts"), join(cwd(), "packages", "dto", "generate", "src", "fail-code.ts"));

  // Packaging type for the dto
  await new Promise((resolve) =>
    nodeExec("cd ./packages/dto && bunx tsc", (e) => {
      resolve(e);
    })
  );

  // build /src/dto/index.ts to js
  await Bun.build({
    entrypoints: ["./packages/dto/index.ts"],
    outdir: "./packages/dto"
  });

  const root = join(cwd(), "packages", "dto");

  console.log("🧊 Loongbao DTO Build Finished");
  console.log("\x1B[2m");
  console.log("Now, your latest code (including changes to your interface) is built to the latest version and waiting for your release!");
  console.log("");
  console.log("If you want to publish it to NPM, you can use a command similar to the following.");
  console.log(`(But before that, you may need to modify the package name (${join(cwd(), "packages", "dto", "package.json")}) and login to your NPM account or private NPM repository)`);

  if (platform !== "win32") {
    console.log("You can publish it to npm by running this commands:\n");
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

await buildDTO();
