import { defineApi, defineApiTest, defineFail } from "loongbao";
import { cwd } from "node:process";
import { join } from "path";
import type typia from "typia";

export const readme = `
# 你好世界

Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World 
Hello World Hello World Hello World Hello World Hello World Hello World
`;

export const api = defineApi({
  meta: {
    //
  },
  async action(params: string & typia.tags.MinLength<3> & typia.tags.MaxLength<16>, context) {
    const paasword = "Pa$$w0rd!";
    if (params !== paasword) throw defineFail("business-fail", "Only with the correct parameters can Cookbook be accessed");
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
