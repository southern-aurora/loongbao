/* eslint-disable no-console */

import ejs from "ejs";
import { join } from "node:path";
import walkSync from "walk-sync";
import { existsSync } from "node:fs";
import { cwd } from "node:process";
import { writeFile } from "node:fs/promises";

export async function generateDatabase() {
  if (existsSync(join(cwd(), "src", "databases"))) {
    if (!existsSync(join("generate", "database-schema.ts"))) {
      await writeFile(join("generate", "database-schema.ts"), ``);
    }
    const filePath = join(cwd(), "generate", "database-schema.ts");
    const databaseFiles = walkSync(join(cwd(), "src", "databases"), {
      directories: false
    }).filter((file) => file.endsWith(".ts"));
    const template = `<% for (const path of ${"databaseFiles"}) { %>export * from '${"../src/databases"}/<%= path.slice(0, -3) %>'
<% } %>`;
    await writeFile(filePath, ejs.render(template, { databaseFiles }));
  }
}
