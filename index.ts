import { createId } from "@paralleldrive/cuid2";
import { env } from "bun";
import { executeApiTest, createLoongbaoApp, executeHttpServer } from "loongbao";
import { httpIOConsoleLog } from "./src/middlewares/http-io-console-log";
import { helloWorld } from "./src/bootstraps/hello-world";

// create loongbao
export const loongbao = await createLoongbaoApp({
  bootstraps: () => [helloWorld()],
  middlewares: () => [httpIOConsoleLog()]
});

if (env.LOONGBAO_TEST) {
  // Decide whether to enter api test mode based on environment
  await executeApiTest(loongbao, env.LOONGBAO_TEST);
} else {
  // start http server
  await executeHttpServer(loongbao, {
    executeIdGenerator: (request) => request.headers.get("X-Scf-Request-Id") ?? createId()
  });
}
