/* eslint-disable no-console */

import ejs from "ejs";
import { join } from "node:path";
import walkSync from "walk-sync";
import { existsSync } from "node:fs";
import { cwd } from "node:process";
import { writeFile } from "node:fs/promises";

export async function generateDatabase() {
  const databaseSchemaSkeleton = ``;
  await writeFile(join(cwd(), "generate", "database-schema.ts"), ejs.render(databaseSchemaSkeleton, {}));

  if (existsSync(join(cwd(), "src", "databases"))) {
    const filePath = join(cwd(), "generate", "database-schema.ts");
    const databaseFiles = walkSync(join(cwd(), "src", "databases"), {
      directories: false
    });
    const template = `<% for (const path of ${"databaseFiles"}) { %>export * from '${"../src/databases"}/<%= path.slice(0, -3) %>'
<% } %>`;
    await writeFile(filePath, ejs.render(template, { databaseFiles }));
  }
}
