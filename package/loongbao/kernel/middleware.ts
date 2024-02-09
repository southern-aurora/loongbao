/* eslint-disable @typescript-eslint/no-explicit-any */

import { createId } from "@paralleldrive/cuid2";
import type { Context } from "../../../src/context";
import type { FrameworkHTTPDetail } from "./context";
import { type LoongbaoApp } from "loongbao";

export type BootstrapMiddleware = (loongbao: LoongbaoApp) => Promise<void> | void;
export const _bootstrapMiddlewares: Array<{
  id: string;
  index: number;
  middleware: BootstrapMiddleware;
}> = [];

export type BeforeExecuteMiddleware = (context: Context) => Promise<void> | void;
export const _beforeExecuteMiddlewares: Array<{
  id: string;
  index: number;
  middleware: BeforeExecuteMiddleware;
}> = [];
export type AfterExecuteMiddleware = (context: Context, response: { value: unknown }) => Promise<void> | void;
export const _afterExecuteMiddlewares: Array<{
  id: string;
  index: number;
  middleware: AfterExecuteMiddleware;
}> = [];

export type AfterHTTPRequestMiddleware = (headers: Headers, detail: FrameworkHTTPDetail) => Promise<void> | void;
export const _afterHTTPRequestMiddlewares: Array<{
  id: string;
  index: number;
  middleware: AfterHTTPRequestMiddleware;
}> = [];

export type BeforeHTTPResponseMiddleware = (response: { value: string }, detail: FrameworkHTTPDetail) => Promise<void> | void;
export const _beforeHTTPResponseMiddlewares: Array<{
  id: string;
  index: number;
  middleware: BeforeHTTPResponseMiddleware;
}> = [];

export type MiddlewareOptions = {
  bootstrap?: BootstrapMiddleware;
  beforeExecute?: BeforeExecuteMiddleware;
  afterExecute?: AfterExecuteMiddleware;
  afterHTTPRequest?: AfterHTTPRequestMiddleware;
  beforeHTTPResponse?: BeforeHTTPResponseMiddleware;
};

export function defineMiddleware(options: MiddlewareOptions): () => MiddlewareOptions & { isMiddleware: true } {
  return () => ({
    ...options,
    isMiddleware: true
  });
}

const push = (index: number, middlewares: Array<any>, middleware: any) => {
  const id = createId();
  middlewares.push({ id, index, middleware });
  return () =>
    middlewares.splice(
      middlewares.findIndex((v) => v.id === id),
      1
    );
};

export function _middlewareHanlder(index: number, options: MiddlewareOptions) {
  if (options.bootstrap) push(index, _bootstrapMiddlewares, options.bootstrap);
  if (options.beforeExecute) push(index, _beforeExecuteMiddlewares, options.beforeExecute);
  if (options.afterExecute) push(index, _afterExecuteMiddlewares, options.afterExecute);
  if (options.afterHTTPRequest) push(index, _afterHTTPRequestMiddlewares, options.afterHTTPRequest);
  if (options.beforeHTTPResponse) push(index, _beforeHTTPResponseMiddlewares, options.beforeHTTPResponse);
}

/**
 * Note: Here, a - b or b - a determines the order of sorting to resemble an "onion".
 */
export async function _sortMiddleware() {
  _bootstrapMiddlewares.sort((a, b) => a.index - b.index);
  _beforeExecuteMiddlewares.sort((a, b) => a.index - b.index);
  _afterExecuteMiddlewares.sort((a, b) => b.index - a.index);
  _afterHTTPRequestMiddlewares.sort((a, b) => a.index - b.index);
  _beforeHTTPResponseMiddlewares.sort((a, b) => b.index - a.index);
}
