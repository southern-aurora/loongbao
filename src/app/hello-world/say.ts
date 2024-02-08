import { defineApi, defineApiTest, defineFail } from "loongbao";
import { type tags } from "typia";

export const api = defineApi({
  meta: {
    //
  },
  action(
    params: {
      by?: string & tags.Pattern<"^[a-z]*$">;
    },
    context
  ) {
    const message = `hello world! (by ${params.by})`;

    if (!params.by) {
      throw defineFail("business-fail", 'You need to include "by" in params.');
    }

    return {
      youSay: message,
      tmp: new Date() as unknown as number
    };
  }
});

export const test = defineApiTest(api, [
  {
    name: "Basic",
    handler: async (test) => {
      const result = await test.execute({
        by: "test"
      });

      if (!result.success || result.data.youSay !== "hello world! (by test)") {
        test.reject("test fail");
      }
    }
  }
]);
