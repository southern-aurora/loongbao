/// <reference path="../types.d.ts" />
/* eslint-disable no-console */

import ejs from "ejs";
import { join } from "node:path";
import walkSync from "walk-sync";
import { existsSync, mkdirSync } from "node:fs";
import { cwd, exit, stdout } from "node:process";
import { unlink, writeFile } from "node:fs/promises";
import { exec as nodeExec } from "node:child_process";
import { camel, hyphen } from "@poech/camel-hump-under";

stdout.write("- Loongbao Generating..");

void (() => {
  const P = ["- Loongbao Generating..", "\\ Loongbao Generating..", "| Loongbao Generating..", "/ Loongbao Generating.."];
  let x = 0;
  return setInterval(() => {
    stdout.write(`\r${P[x++]}`);
    x &= P.length - 1;
  }, 64);
})();

const utils = {
  camel: (str: string) => camel(str).replaceAll("-", "").replaceAll("_", ""),
  hyphen: (str: string) => hyphen(str).replaceAll("_", "")
};

export async function generateSchema() {
  // Make sure that the existing directories are all present
  existsSync(join("generate")) || mkdirSync(join("generate"));
  existsSync(join("generate", "raw")) || mkdirSync(join("generate", "raw"));

  // Delete the files generated in the past and regenerate them
  try {
    await unlink(join(cwd(), "generate", "api-schema.ts"));
  } catch (error) {} // Maybe the file does not exist

  if (!existsSync(join("generate", "README.md"))) {
    await writeFile(join("generate", "README.md"), "⚠️ All files in this directory are generated by Loongbao. Please do not modify the content, otherwise your modifications will be overwritten in the next generation.");
  }

  // Write a basic framework to ensure that there are no errors when reading later
  const apiSchemaSkeleton = `
  export default {
    apiParamsValidator: {},
    apiMethodsSchema: {},
    apiMethodsTypeSchema: {},
  }
  `;
  await writeFile(join(cwd(), "generate", "api-schema.ts"), ejs.render(apiSchemaSkeleton, { utils }));

  // Generate api-schema.ts file through templates
  const templateVars = {
    utils,
    apiPaths: [] as Array<string>,
    apiTestPaths: [] as Array<string>
  };

  const appFiles = walkSync(join(cwd(), "src", "app"), {
    directories: false
  });

  for (const path of appFiles) {
    if (!path.endsWith(".ts")) continue;
    const module = await import(/* @vite-ignore */ `../../../src/app/${path}`);
    if (module?.api?.isApi === true) {
      // Exclude disallowed characters
      if (path.includes("_")) {
        console.error(`\n\nPath: ` + path);
        console.error(`Do not use "_" in the path. If you want to add a separator between words, please use "-".\n`);
        exit(1);
      }
      if (/^[a-z0-9/-]+$/.test(path)) {
        console.error(`\n\nPath: ` + path);
        console.error(`The path can only contain lowercase letters, numbers, and "-".\n`);
        exit(1);
      }

      templateVars.apiPaths.push(path);

      if (module?.test?.isApiTest === true) {
        templateVars.apiTestPaths.push(path);
      }
    }
  }

  await writeFile(
    join(cwd(), "generate", "api-schema.ts"),
    ejs.render(
      `
/**
 * ⚠️ This file is generated and modifications will be overwritten
 */
 
// api
<% for (const path of ${"apiPaths"}) { %>import type * as <%= utils.camel(path.slice(0, -3).replaceAll('/', '$')) %> from '${"../src/app"}/<%= path.slice(0, -3) %>'
<% } %>
import _apiParamsValidator from './products/api-params-validator'

export default {
  apiParamsValidator: _apiParamsValidator,
  ${"apiMethodsSchema"}: {
    <% for (const path of apiPaths) { %>'<%= utils.hyphen(path.slice(0, -${3})) %>': () => ({ module: import('../src/app/<%= path.slice(0, -${3}) %>') }),
    <% } %>
  },
  ${"apiMethodsTypeSchema"}: {
    <% for (const path of apiPaths) { %>'<%= utils.hyphen(path.slice(0, -${3})) %>': undefined as unknown as typeof <%= utils.camel(path.slice(0, -${3}).replaceAll('/', '$')) %>,
    <% } %>
  },
  ${"apiTestsSchema"}: {
    <% for (const path of apiTestPaths) { %>'<%= utils.hyphen(path.slice(0, -${3})) %>': () => ({ module: import('../src/app/<%= path.slice(0, -${3}) %>') }),
    <% } %>
  },
}
 `.trim(),
      templateVars
    )
  );

  // api
  const apiParamsValidatorTemplate = `/**
 * ⚠️This file is generated and modifications will be overwritten
 */

import typia from 'typia'

// api
<% for (const path of ${"apiPaths"}) { %>import type * as <%= utils.camel(path.slice(0, -3).replaceAll('/', '$')) %> from '${"../../src/app"}/<%= path.slice(0, -3) %>'
<% } %>
export default {
  ${"validate"}: {
    <% for (const path of apiPaths) { %>'<%= utils.hyphen(path.slice(0, -${3})) %>': async (params: unknown) => typia.misc.validatePrune<Parameters<typeof <%= utils.camel(path.replaceAll('/', '$').slice(0, -${3})) %>['api']['action']>[0]>(params),
    <% } %>
  },
}
`.trim();
  await writeFile(join(cwd(), "generate", "raw", "api-params-validator.ts"), ejs.render(apiParamsValidatorTemplate, templateVars));

  if (Bun.env.PARAMS_VALIDATE !== "false") {
    await new Promise((resolve) =>
      nodeExec("bunx typia generate --input generate/raw --output generate/products --project tsconfig.json", (e) => {
        resolve(e);
      })
    );
  }
}

await generateSchema();

stdout.write("\r");
stdout.clearLine(1);
console.log("✅ Loongbao Generated!");

exit(0);
