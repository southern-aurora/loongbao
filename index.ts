import { createId } from "@paralleldrive/cuid2";
import { env } from "bun";
import { executeApiTest, createLoongbaoApp, TSON } from "loongbao";

// create loongbao
export const loongbao = await createLoongbaoApp();

if (env.LOONGBAO_TEST) {
  // Decide whether to enter api test mode based on environment
  await executeApiTest(loongbao, TSON.parse(env.LOONGBAO_TEST));
} else {
  // start http server
  await loongbao.executeHttpServer({
    executeIdGenerator: (request) => request.headers.get("X-Scf-Request-Id") ?? createId()
  });
}
