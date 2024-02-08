import { failCode } from "../../../src/fail-code";

export function defineFail<Code extends keyof typeof failCode, FailData extends (typeof failCode)[Code]>(code: Code, data: Parameters<FailData>[0]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = failCode[code]?.(data as any) ?? "";
  const error = {
    name: "FailError",
    code,
    message,
    data,
    stack: ""
  };
  Error.captureStackTrace(error);
  error.stack = error.stack.replace(/\n.*\n/, "\n");
  return error;
}

export type FailError = ReturnType<typeof defineFail>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoongbaoFailCode = Record<string, (arg: any) => string>;

export type LoongbaoMeta = {
  enableResultsValidate?: boolean;
};
