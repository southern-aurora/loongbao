/// <reference path="../types.d.ts" />
/* eslint-disable no-console */

import ejs from "ejs";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { cwd, env, exit, stdout } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import { exec as nodeExec } from "node:child_process";
import { camel, hyphen } from "@poech/camel-hump-under";

stdout.write("- Loongbao Quick Generating..");

void (() => {
  const P = ["- Loongbao Quick Generating..", "\\ Loongbao Quick Generating..", "| Loongbao Quick Generating..", "/ Loongbao Quick Generating.."];
  let x = 0;
  return setInterval(() => {
    stdout.write(`\r${P[x++]}`);
    x &= P.length - 1;
  }, 48);
})();

const utils = {
  camel: (str: string) => camel(str).replaceAll("-", "").replaceAll("_", ""),
  hyphen: (str: string) => hyphen(str).replaceAll("_", "")
};

export async function generatePartial() {
  const partialPath = env.GENERATE_PARTIAL_PATH!;
  const partialDir = partialPath.split("/").slice(0, -1).join("/");
  // Generate api-schema.ts file through templates
  const templateVars = {
    utils
  };

  if (!partialPath.endsWith(".ts")) return;
  const module = await import(/* @vite-ignore */ `../../../src/app/${partialPath}`);
  if (module?.api?.isApi === true) {
    // Exclude disallowed characters
    if (partialPath.includes("_")) {
      console.error(`\n\nPath: ` + partialPath);
      console.error(`Do not use "_" in the path. If you want to add a separator between words, please use "-".\n`);
      exit(1);
    }
    if (/^[a-z0-9/-]+$/.test(partialPath)) {
      console.error(`\n\nPath: ` + partialPath);
      console.error(`The path can only contain lowercase letters, numbers, and "-".\n`);
      exit(1);
    }
  }

  // typia
  const filePathTmp = join(cwd(), "generate", "raw-tmp", "app", partialPath);
  const dirPathTmp = join(cwd(), "generate", "raw-tmp", "app", partialPath).split("/").slice(0, -1).join("/");
  const filePath = join(cwd(), "generate", "raw", "app", partialPath);
  if (!existsSync(dirPathTmp)) {
    mkdirSync(dirPathTmp, { recursive: true });
  }
  let importPath = "../../../";

  for (let i = 0; i < partialPath.split("/").length - 1; i++) {
    importPath = importPath + "../";
  }
  importPath = importPath + "src/app";
  const template = `
import typia from "typia";
import { ExecuteResultSuccess${module?.api?.meta?.enableResultsValidate ? ", _validate" : ""} } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as <%= utils.camel(path.slice(0, -3).replaceAll('/', '$')) %> from '${importPath}/<%= path.slice(0, -3) %>';

type ParamsT = Parameters<typeof <%= utils.camel(path.replaceAll('/', '$').slice(0, -${3})) %>['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);
export const paramsSchema = typia.json.application<[{ data: ParamsT }], "swagger">();
type HTTPResultsT = Awaited<ReturnType<typeof <%= utils.camel(path.replaceAll('/', '$').slice(0, -${3})) %>['api']['action']>>;
export const HTTPResults = async (results: any) => { ${module?.api?.meta?.enableResultsValidate ? "_validate(typia.validate<TSONEncode<ExecuteResultSuccess<HTTPResultsT>>>(results));" : ""} return typia.json.stringify<TSONEncode<ExecuteResultSuccess<HTTPResultsT>>>(results); };
`.trim();

  await writeFile(filePathTmp, ejs.render(template, { ...templateVars, path: partialPath }));

  if (Bun.env.PARAMS_VALIDATE !== "false") {
    await new Promise((resolve) =>
      nodeExec(`bun run ./node_modules/typia/lib/executable/typia.js generate --input generate/raw-tmp/app/${partialDir} --output generate/products-tmp/app/${partialDir} --project tsconfig.json`, (e) => {
        resolve(e);
      })
    );
    await Promise.all([writeFile(filePath, ejs.render(template, { ...templateVars, path: partialPath })), writeFile(join(cwd(), "generate", "products", "app", partialPath), (await readFile(join(cwd(), "generate", "products-tmp", "app", partialPath))).toString())]);
  } else {
    await writeFile(filePath, ejs.render(template, { ...templateVars, path: partialPath }));
  }
}

await generatePartial();

stdout.write("\r");
stdout.clearLine(1);
console.log("✅ Loongbao Generated!");

exit(0);
