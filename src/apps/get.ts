import { defineApi, defineApiTest } from "loongbao";
import type typia from "typia";

export const api = defineApi({
  meta: {
    //
  },
  action(
    params: {
      hello?: "world";
      by?: string & typia.tags.MinLength<2> & typia.tags.MaxLength<16>;
    },
    context
  ) {
    const message = `hello world! (by ${params.by})`;

    return {
      youSay: message
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

      if (!result.success) {
        test.reject(`The result was not success`);
        return;
      }
      if (result.data.youSay !== "hello world! (by test)") {
        test.reject(`"youSay" is inconsistent with expectations.`);
        return;
      }
    }
  },
  {
    name: "Basic 2",
    handler: async (test) => {
      const result = await test.execute({
        by: "test"
      });

      if (!result.success) {
        test.reject(`The result was not success`);
        return;
      }
      if (result.data.youSay !== "hello world! (by test)") {
        test.reject(`"youSay" is inconsistent with expectations.`);
        return;
      }
    }
  }
]);
