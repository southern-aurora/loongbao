/* eslint-disable no-console */

import ejs from "ejs";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { cwd, env, exit } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import { exec as nodeExec } from "node:child_process";
import { camel, hump, hyphen } from "@poech/camel-hump-under";

const utils = {
  camel: (str: string) => camel(str).replaceAll("-", "").replaceAll("_", ""),
  hump: (str: string) => hump(str).replaceAll("-", "").replaceAll("_", ""),
  hyphen: (str: string) => hyphen(str).replaceAll("_", "")
};

export async function generateAppPartial(path?: string) {
  const partialPath = path ?? env.GENERATE_PARTIAL_PATH!;
  const partialDir = partialPath.split("/").slice(0, -1).join("/");
  // Generate api-schema.ts file through templates
  const templateVars = {
    utils
  };

  if (!partialPath.endsWith(".ts")) return;
  const module = await import(/* @vite-ignore */ `../../../../src/apps/${partialPath}`);
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
  const filePathTmp = join(cwd(), "generate", "raw-tmp", "apps", partialPath);
  const dirPathTmp = join(cwd(), "generate", "raw-tmp", "apps", partialPath).split("/").slice(0, -1).join("/");
  const filePath = join(cwd(), "generate", "raw", "apps", partialPath);
  if (!existsSync(dirPathTmp)) {
    mkdirSync(dirPathTmp, { recursive: true });
  }
  let importPath = "../../../";

  for (let i = 0; i < partialPath.split("/").length - 1; i++) {
    importPath = importPath + "../";
  }
  importPath = importPath + "src/apps";
  const template = `
import typia from "typia";
import { _validate, type ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as <%= utils.camel(path.slice(0, -3).replaceAll('/', '$')) %> from '${importPath}/<%= path.slice(0, -3) %>';

type ParamsT = Parameters<typeof <%= utils.camel(path.replaceAll('/', '$').slice(0, -${3})) %>['api']['action']>[0];
export const params = async (params: any) => typia.misc.validatePrune<ParamsT>(params);
type ResultsT = Awaited<ReturnType<typeof <%= utils.camel(path.replaceAll('/', '$').slice(0, -${3})) %>['api']['action']>>;
export const results = async (results: any) => { _validate(typia.validate<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results)); return typia.json.stringify<TSONEncode<ExecuteResultSuccess<ResultsT>>>(results); };
`.trim();

  await writeFile(filePathTmp, ejs.render(template, { ...templateVars, path: partialPath }));

  await new Promise((resolve) =>
    nodeExec(`bun run ./node_modules/typia/lib/executable/typia.js generate --input generate/raw-tmp/apps/${partialDir} --output generate/products-tmp/apps/${partialDir} --project tsconfig.json`, (e) => {
      resolve(e);
    })
  );
  await Promise.all([writeFile(filePath, ejs.render(template, { ...templateVars, path: partialPath })), writeFile(join(cwd(), "generate", "products", "apps", partialPath), (await readFile(join(cwd(), "generate", "products-tmp", "apps", partialPath))).toString())]);
}
