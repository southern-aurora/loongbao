import { defineApi, defineApiTest, defineFail } from "loongbao";
import { cwd } from "node:process";
import { join } from "path";

export const api = defineApi({
  meta: {
    //
  },
  async action(params: string, context) {
    if (params !== "Pa$$w0rd!") throw defineFail("business-fail", "Only with the correct parameters can Cookbook be accessed");
    return Bun.file(join(cwd(), "generate", "cookbook.json")).json();
  }
});

export const test = defineApiTest(api, [
  {
    name: "Basic",
    handler: async (test) => {
      const result = await test.execute("Pa$$w0rd!");

      if (!result.success) {
        test.reject(`The result was not success`);
        return;
      }
    }
  },
  {
    name: "Basic 2",
    handler: async (test) => {
      const result = await test.execute("Pa$$w0rd!");

      if (!result.success) {
        test.reject(`The result was not success`);
        return;
      }
    }
  }
]);
