import { defineApi } from "loongbao";

export const api = defineApi({
  meta: {},
  action(params: undefined, context) {
    const arr: Array<{
      id: number;
      title: string;
    }> = [];
    for (let i = 0; i < 100; i++) {
      arr.push({
        id: i,
        title: `title ${i}`
      });
    }

    return {
      total: arr.length,
      list: arr
    };
  }
});
