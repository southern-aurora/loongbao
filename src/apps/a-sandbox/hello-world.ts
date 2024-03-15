import { defineApi, defineApiTest } from "loongbao";

/**
 * hello-world
 */
export const api = defineApi({
  meta: {
    //
  },
  async action(
    params: {
      //
    },
    context
  ) {
    const message = `hello world!`;

    // ..

    return {
      say: message
    };
  }
});

export const test = defineApiTest(api, [
  {
    name: "Basic",
    handler: async (test) => {
      const result = await test.execute({
        //
      });

      // ..

      if (!result.success) return test.reject(`The result was not success`);
    }
  }
]);