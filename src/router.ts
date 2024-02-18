import type ApiParams from "../generate/api-schema";

export const routerHandler = async (path: string, fullurl: URL): Promise<false | keyof (typeof ApiParams)["apiMethodsSchema"]> => {
  // ...
  return false;
};
