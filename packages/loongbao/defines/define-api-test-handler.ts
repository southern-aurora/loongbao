/* eslint-disable @typescript-eslint/no-unsafe-argument, no-console, @typescript-eslint/no-explicit-any */
import { exit } from "node:process";
import schema from "../../../generate/api-schema";
import { type LoongbaoApp } from "..";

export const defineApiTestHandler = async <Paths extends Array<keyof (typeof schema)["apiTestsSchema"]>>(app: LoongbaoApp, paths: Paths | string | 1 | undefined) => {
  console.log(`🧊 Loongbao Api Testing..\n`);

  if (!paths) {
    console.log("🧊 No paths specified.");
    exit(1);
  }

  if (paths === "1" || paths === 1) {
    paths = Object.keys(schema.apiTestsSchema) as unknown as Paths;
  } else if (typeof paths === "string") {
    if (!paths.startsWith("[")) {
      paths = [paths] as Paths;
    } else {
      paths = JSON.parse(paths) as Paths;
    }
  }

  const tests = [];
  const startedAt = new Date().getTime();

  for (let path of paths) {
    if (path.startsWith("/")) path = path.slice(1) as Paths[number];
    tests.push(
      // @ts-ignore
      (async () => {
        // @ts-ignore
        const module = await schema.apiTestsSchema[path]().module;
        const cases = module.test.getCases();
        let i = 0;
        for (const cs of cases) {
          ++i;
          const csStartedAt = new Date().getTime();
          const clear = setTimeout(() => {
            console.error(`------`);
            console.error(`❌ TIMEOUT -- More than ${cs.timeout ?? 6000}ms`);
            console.error(`   ${cs.name} | Path: src/apps/${path as string}.ts | Case: ${i}`);
            console.error(`------`);
            exit(1);
          }, cs.timeout ?? 6000);
          await cs.handler({
            execute: async (params: any, headers?: any, options?: any) => app.execute(path, params, headers ?? {}, options),
            reject: (message?: string) => {
              console.error(`------`);
              console.error(`❌ REJECT -- ${message ?? "Test not satisfied"}`);
              console.error(`   ${cs.name} | Path: src/apps/${path as string}.ts | Case: ${i} | Time: ${new Date().getTime() - csStartedAt}ms`);
              console.error(`------`);
              exit(1);
            }
          });
          clearTimeout(clear);
          console.log(`✅ DIRECT --  ${cs.name} | Path: src/apps/${path as string}.ts | Case: ${i} | Time: ${new Date().getTime() - csStartedAt}ms`);
        }
      })()
    );
  }

  await Promise.all(tests);

  const endedAt = new Date().getTime();

  console.log(`\n✅ All tests passed.`);
  console.log(`🧊 Loongbao Api Testing took ${((endedAt - startedAt) / 1000).toFixed(2)}s\n`);
  exit(0);
};
