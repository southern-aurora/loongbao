import { defineApi, defineApiTest, defineFail } from "loongbao";
import { cwd } from "node:process";
import { join } from "path";
import type typia from "typia";

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
