import type apiValidator from "../generate/api-validator";

export const routerHandler = async (path: string, fullurl: URL): Promise<false | keyof (typeof apiValidator)["apiMethodsSchema"]> => {
  // ...
  return false;
};
