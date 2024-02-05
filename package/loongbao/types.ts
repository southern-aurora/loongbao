import { type createLoongbaoApp } from ".";
import type { failCode } from "../../src/fail-code";

export type LoongbaoApp = Awaited<ReturnType<typeof createLoongbaoApp>>;

export type ExecuteId = `exec#${string}` | "global";

export type FailEnumerates = typeof failCode;

export type HTTPRequest = Request;

export type HTTPResponse = Override<ResponseInit & { body: string | null | undefined }, { headers: NonNullable<ResponseInit["headers"]> }>;

export type Fail<FailCode extends keyof FailEnumerates> = {
  code: FailCode;
  message: string;
  data: Parameters<FailEnumerates[FailCode]>[0];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type DatabaseType<Table extends { findFirst: () => unknown }, Override = {}> = Mixin<NonNullable<Awaited<ReturnType<Table["findFirst"]>>>, Override>;

export type Override<P, S> = Omit<P, keyof S> & S;

export type Mixin<T, U> = U & Omit<T, keyof U>;
