/* eslint-disable @typescript-eslint/no-misused-promises, no-console, @typescript-eslint/no-explicit-any */

import { argv, cwd, env, exit } from "node:process";
import { exec } from "../util/exec";
import { join } from "node:path";
import { $ } from "bun";
import { readFile } from "node:fs/promises";

const rootPath = cwd();
const method = argv[2] as keyof typeof commands;
const params = argv.slice(3) as Parameters<(typeof commands)[keyof typeof commands]>;

const commands = {
  async generate() {
    await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"]);
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
        LOONGBAO_RUN_MODE: "test",
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
  /**
   * The following methods have been deprecated
   * The logic of this part is moved to be implemented by VSCode extension
   */
  // async dev() {
  //   const appPath = join(cwd(), "src", "apps");

  //   let proactive = false;
  //   let proc: any;
  //   let locker = false;
  //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //   const watcher = watch(appPath, { recursive: true }, async (event, filename) => {
  //     if (locker) return;
  //     locker = true;
  //     proactive = true;
  //     await proc.kill();
  //     if (event === "change") {
  //       const path = join(appPath, filename!).slice(join(cwd(), "src", "apps").length + 1);
  //       // eslint-disable-next-line no-void
  //       void run(path);
  //     } else {
  //       void run(undefined);
  //     }
  //   });
  //   process.on("SIGINT", () => {
  //     // close watcher when Ctrl-C is pressed
  //     watcher.close();
  //     process.exit(0);
  //   });
  //   const run = async (path?: string) => {
  //     return await new Promise((resolve, reject) => {
  //       (!path
  //         ? exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate.ts"], {
  //             env: { ...env, PARAMS_VALIDATE: env.PARAMS_VALIDATE }
  //           })
  //         : exec(rootPath, ["bun", "./node_modules/loongbao/scripts/generate-partial.ts"], {
  //             env: { ...env, PARAMS_VALIDATE: env.PARAMS_VALIDATE, GENERATE_PARTIAL_PATH: path }
  //           })
  //       )
  //         .then(() => {
  //           locker = false;
  //           proactive = false;
  //           proc = Bun.spawn(["bun", "--inspect", "--hot", "./index.ts"], {
  //             stdin: "inherit",
  //             stdout: "inherit",
  //             env: { ...env, PARAMS_VALIDATE: env.PARAMS_VALIDATE },
  //             cwd: cwd(),
  //             onExit(_, exitCode) {
  //               if (!proactive) {
  //                 exit(exitCode ?? 0);
  //               }
  //             }
  //           });

  //           // After the server starts, compile the cookbook in parallel
  //           setTimeout(async () => {
  //             rmSync(join(cwd(), "generate", "raw-tmp"), { recursive: true, force: true });
  //             rmSync(join(cwd(), "generate", "products-tmp"), { recursive: true, force: true });
  //             await exec(rootPath, ["bun", "./node_modules/loongbao/scripts/build-cookbook.ts"]);
  //           }, 0);
  //         })
  //         .catch((error) => {
  //           locker = false;
  //           proactive = false;
  //           reject(error);
  //         });
  //     });
  //   };

  //   await run();
  // },
};

if (method === undefined || !(method in commands)) {
  console.log("Command does not exist, Supported commands are:");
  console.log("  " + Object.keys(commands).join(", "));
  exit(1);
}

await commands[method](...params);

exit(0);
