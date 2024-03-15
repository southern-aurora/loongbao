#!/usr/bin/env bun

/* eslint-disable @typescript-eslint/no-misused-promises, no-console, @typescript-eslint/no-explicit-any */

import { argv, cwd, env, exit } from "node:process";
import { exec } from "./utils/exec";
import { join } from "node:path";
import { $ } from "bun";
import { readFile } from "node:fs/promises";

const rootPath = cwd();
const method = argv[2] as keyof typeof commands;
const params = argv.slice(3) as Parameters<(typeof commands)[keyof typeof commands]>;

const commands = {
  async gen() {
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
  },
  async "gen:database"() {
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate-database.ts"]);
  },
  async "build:cookbook"() {
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/build-cookbook.ts"]);
  },
  async "build:dto"() {
    await exec(join(rootPath, "packages", "dto"), ["bun", "i"]);
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/build-dto.ts"]);
  },
  async test(files?: string, reserved?: string) {
    const run = async () => {
      const packageJson = await JSON.parse((await readFile(join(rootPath, "package.json"))).toString());
      await $`${{ raw: packageJson.scripts.start }}`.env({
        ...env,
        LOONGBAO_RUN_MODE: "API_TEST",
        LOONGBAO_TEST: files ?? "1"
      });
    };
    if (!env.LOONGBAO_TEST_RESERVED && reserved !== "1") {
      // Normal test
      await run();
    } else {
      // Keep after testing, the terminal never exits and is usually used for various IDE extensions.
      try {
        await run();
      } catch (error) {}
      while (true) {
        const result = await new Promise((resolve) => {
          const wasRaw = process.stdin.isRaw;
          process.stdin.setRawMode(true);
          process.stdin.resume();
          process.stdin.once("data", (data) => {
            process.stdin.pause();
            process.stdin.setRawMode(wasRaw);
            resolve(data.toString());
          });
        });
        // No exit function is set
        // if (result === "q") exit(0);
      }
    }
  }
};

if (method === undefined || !(method in commands)) {
  console.log("Command does not exist, Supported commands are:");
  console.log("  " + Object.keys(commands).join(", "));
  exit(1);
}

await commands[method](...params);

exit(0);
