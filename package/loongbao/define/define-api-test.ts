import { type Api, type ExecuteResult, type ExecuteApiOptions } from "..";

export function defineApiTest<ApiT extends Api>(_api: ApiT, cases: Array<ApiTestCases<ApiT>>) {
  return {
    getCases: () => cases,
    isApiTest: true
  };
}

export type ApiTestCases<ApiT extends Api> = {
  handler: (test: { execute: (params: Parameters<ApiT["action"]>[0], headers?: Record<string, string>, options?: ExecuteApiOptions) => Promise<ExecuteResult<Awaited<ReturnType<ApiT["action"]>>>>; reject: (message?: string) => void }) => Promise<void> | void;
  name: string;
  timeout?: number;
};
