import { failCode } from "../../../src/fail-code";

export function reject<Code extends keyof typeof failCode, FailData extends (typeof failCode)[Code]>(code: Code, data: Parameters<FailData>[0]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  const message = failCode[code]?.(data as any) ?? "";
  const error = {
    name: "LoongbaoReject",
    code,
    message,
    data,
    stack: ""
  };
  Error.captureStackTrace(error);
  error.stack = error.stack.replace(/\n.*\n/, "\n");

  return error;
}

export type LoongbaoReject = ReturnType<typeof reject>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoongbaoFailCode = Record<string, (arg: any) => string>;
