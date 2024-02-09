#!/usr/bin/env bun

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { argv, cwd, exit, stdout } from "node:process";
import { exec } from "../util/exec";
import { join } from "node:path";
import { watch } from "node:fs";
import { env } from "bun";

const rootPath = cwd();
const method = argv[2] as keyof typeof commands;
const params = argv.slice(3) as Parameters<(typeof commands)[keyof typeof commands]>;

const commands = {
  async generate() {
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
  },
  async dev() {
    const appPath = join(cwd(), "src", "app");

    let proactive = false;
    let proc: any;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const watcher = watch(appPath, { recursive: true }, async () => {
      proactive = true;
      await proc.kill();

      // eslint-disable-next-line no-void
      void run();
    });
    process.on("SIGINT", () => {
      // close watcher when Ctrl-C is pressed
      watcher.close();
      process.exit(0);
    });
    const run = async () => {
      return await new Promise((resolve, reject) => {
        exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"], {
          env: { ...env, PARAMS_VALIDATE: env.PARAMS_VALIDATE }
        })
          .then(() => {
            proactive = false;
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

    await run();
  },
  async start() {
    await exec(rootPath, ["bun", "./index.ts"]);
  },
  async test(files?: string, reserved?: string) {
    if (reserved !== "1") {
      // Normal test
      await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
      await exec(rootPath, ["bun", "./index.ts"], {
        env: {
          ...env,
          LOONGBAO_TEST: files ?? "1"
        }
      });
    } else {
      // Keep after testing, the terminal never exits and is usually used for various IDE extensions.
      try {
        await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
        await exec(rootPath, ["bun", "./index.ts"], {
          env: {
            ...env,
            LOONGBAO_TEST: files ?? "1"
          }
        });
      } catch (error) {}
      stdout.write("\x1B[2mpress (q) to quit..");
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

        if (result === "q") exit(0);
      }
    }
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
