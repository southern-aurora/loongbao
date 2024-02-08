import type apiParamsValidator from "../generate/api-params-validator";

export const routerHandler = async (path: string, fullurl: URL): Promise<false | keyof (typeof apiParamsValidator)["apiMethodsSchema"]> => {
  // ...
  return false;
};
