import { configFramework, createLoongbaoApp, defineApiTestHandler, defineHttpHandler, envToNumber } from "loongbao";
import { env } from "node:process";
import { helloWorld } from "./src/bootstraps/hello-world";
import { httpIOConsoleLog } from "./src/middlewares/http-io-console-log";
import { useDrizzle } from "./src/uses/drizzle";

export const loongbao = await createLoongbaoApp({
  bootstraps: () => [helloWorld()],
  middlewares: () => [httpIOConsoleLog()]
});

console.log("RUN_MODE", configFramework.loongbaoRunMode);

if (configFramework.loongbaoRunMode === "DEFAULT") {
  // start http server
  const httpHandler = defineHttpHandler(loongbao);
  // if you are using Bun
  Bun.serve({
    port: envToNumber(env.PORT, 9000),
    fetch(request) {
      return httpHandler({ request });
    }
  });
}

if (configFramework.loongbaoRunMode === "API_TEST") {
  // decide whether to enter api test mode based on environment
  await defineApiTestHandler(loongbao, configFramework.loongbaoTest);
}

if (configFramework.loongbaoRunMode === "MIGRATE") {
  // (optional) migrate the database structure to the production environment
  const drizzle = await useDrizzle();
  const { migrate } = await import("drizzle-orm/mysql2/migrator");
  await migrate(drizzle, { migrationsFolder: "drizzle" });
}
