import { createLoongbaoApp, defineApiTestHandler, defineHttpHandler } from "loongbao";
import { httpIOConsoleLog } from "./src/middlewares/http-io-console-log";
import { helloWorld } from "./src/bootstraps/hello-world";
import { createId } from "@paralleldrive/cuid2";
import { env } from "node:process";
import { Hono } from "hono";

// create loongbao
export const loongbao = await createLoongbaoApp({
  bootstraps: () => [helloWorld()],
  middlewares: () => [httpIOConsoleLog()]
});

if (!env.LOONGBAO_TEST) {
  // start http server
  const loongbaoHttpHandler = await defineHttpHandler(loongbao, {
    executeIdGenerator: (request) => request.headers.get("X-Scf-Request-Id") ?? createId()
  });
  // combined with Hono
  const app = new Hono();
  app.all("*", async (honoContext) => {
    const response = await loongbaoHttpHandler.fetch(honoContext.req.raw);
    return new Response(response.body, response);
  });
} else {
  // decide whether to enter api test mode based on environment
  await defineApiTestHandler(loongbao, env.LOONGBAO_TEST);
}
