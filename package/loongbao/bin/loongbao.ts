#!/usr/bin/env bun

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { argv, cwd, exit } from "node:process";
import { exec } from "../util/exec";
import { join } from "node:path";
import { watch } from "node:fs";
import { env } from "bun";
import { TSON } from "..";

const rootPath = cwd();
const method = argv[2] as keyof typeof commands;
const params = argv.slice(3) as Parameters<(typeof commands)[keyof typeof commands]>;

const commands = {
  async generate() {
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
  },
  async dev() {
    const appPath = join(cwd(), "src", "app");
    const run = async () => {
      return new Promise((resolve, reject) => {
        let proactive = false;
        let proc: any;
        const watcher = watch(appPath, { recursive: true }, () => {
          proactive = true;
          watcher.close();
          proc.kill();
          resolve(undefined);
        });
        process.on("SIGINT", () => {
          // close watcher when Ctrl-C is pressed
          watcher.close();
          process.exit(0);
        });

        exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"], {
          env: { ...env, PARAMS_VALIDATE: env.PARAMS_VALIDATE }
        })
          .then(() => {
            proc = Bun.spawn(["bun", "--inspect", "--hot", "./index.ts"], {
              stdin: "inherit",
              stdout: "inherit",
              env: { ...env, PARAMS_VALIDATE: env.PARAMS_VALIDATE },
              cwd: cwd(),
              onExit(_, exitCode) {
                if (!proactive) {
                  exit(exitCode ?? 0);
                }
              }
            });
          })
          .catch(reject);
      });
    };

    while (true) {
      await run();
    }
  },
  async start() {
    await exec(rootPath, ["bun", "./index.ts"]);
  },
  async test() {
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
    await exec(rootPath, ["bun", "./index.ts"], {
      env: {
        ...env,
        LOONGBAO_TEST: TSON.stringify(1)
      }
    });
  },
  async "build:client"() {
    await exec(join(rootPath, "package", "client"), ["bun", "i"]);
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/build-client.ts"]);
  }
};

if (method === undefined || !(method in commands)) {
  console.log("Command does not exist, Supported commands are:");
  console.log("  " + Object.keys(commands).join(", "));
  exit(1);
}

await commands[method](...params);

exit(0);
