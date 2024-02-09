/* eslint-disable no-console, @typescript-eslint/no-invalid-void-type, @typescript-eslint/await-thenable, @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import { configFramework } from "..";
import { _sortMiddleware, _afterExecuteMiddlewares, _beforeExecuteMiddlewares, _bootstrapMiddlewares, _middlewareHanlder, type MiddlewareOptions } from "./middleware";
import { createId } from "@paralleldrive/cuid2";
import schema from "../../../generate/api-schema";
import type { Context } from "../../../src/context";
import { failCode } from "../../../src/fail-code";
import type { FrameworkContext } from "./context";

import { type ExecuteId, type Fail, type FailEnumerates, loggerPushTags, loggerSubmit, runtime } from "..";
import { hanldeCatchError } from "../util/handle-catch-error";
import { _validate } from "./validate";
import { exit } from "node:process";

export type LoongbaoAppOptions = {
  /**
   * bootstraps
   * @description
   * When Loongbao is launched, all methods in this array will run **in parallel**.
   */
  bootstraps?: () => Array</* This type is long, and its intention is to prevent someone from forgetting to add parentheses when adding bootstraps. Therefore, it allows all types except methods */ Promise<unknown> | void | string | number | boolean | null | undefined | Record<string | number | symbol, unknown> | Array<unknown>>;
  /**
   * middlewares
   * @description
   * When Loongbao is launched, the closer it is to the front of the array, the more it is on the outer layer of the "onion".
   */
  middlewares?: () => Array<MiddlewareOptions & { isMiddleware: true }>;
  /**
   * maxRequest
   * @description
   * When the function runs for a long time, it is possible that the memory will continuously expand (not necessarily due to memory leaks, but also possibly due to having a large number of routes).
   * Set a maximum number of requests, when the number of requests reaches this value, kill the process and automatically restart it from outside (K8S or whatever).
   */
  maxRequest?: number | null | undefined;
  /**
   * maxRunningTime (minutes)
   * @description
   * When the function runs for a long time, it is possible that the memory will continuously expand (not necessarily due to memory leaks, but also possibly due to having a large number of routes).
   * Set the maximum running time (in minutes). When Loongbao's running time reaches this value, terminate the process and automatically restart it from outside (K8S or other means).
   */
  maxRunningTimeout?: number | null | undefined;
};

export async function createLoongbaoApp(loongbaoAppOptions: LoongbaoAppOptions = {}) {
  console.log(`🧊 Framework starting on "${configFramework.cwd}"`);

  if (loongbaoAppOptions.maxRequest && loongbaoAppOptions.maxRequest >= 1) {
    runtime.maxRequest.expected = loongbaoAppOptions.maxRequest;
    runtime.maxRequest.enable = true;
  }

  if (loongbaoAppOptions.maxRunningTimeout && loongbaoAppOptions.maxRunningTimeout >= 1) {
    setTimeout(() => {
      console.log('❌ Loongbao reached the limit of "maxRunningTimeout" in the options and automatically exited.');
      exit(0);
    }, loongbaoAppOptions.maxRunningTimeout * 60 * 1000);
    runtime.maxRunningTimeout.enable = true;
  }

  const loongbaoApp = {
    execute: _execute,
    executeCore: _executeCore
  };

  if (loongbaoAppOptions.bootstraps) {
    await Promise.all(loongbaoAppOptions.bootstraps());
  }

  if (loongbaoAppOptions.middlewares) {
    const middlewares = loongbaoAppOptions.middlewares();

    for (let index = 0; index < middlewares.length; index++) {
      const middlewareOptions = middlewares[index];
      _middlewareHanlder(index, middlewareOptions);
    }
    await _sortMiddleware();
    for (const m of _bootstrapMiddlewares) {
      await m.middleware(loongbaoApp);
    }
  }

  return loongbaoApp;
}

async function _execute<Path extends keyof (typeof schema)["apiMethodsTypeSchema"], Result extends Awaited<ReturnType<(typeof schema)["apiMethodsTypeSchema"][Path]["api"]["action"]>>>(path: Path, params: Parameters<(typeof schema)["apiMethodsTypeSchema"][Path]["api"]["action"]>[0] | string, headersInit: Record<string, string> | Headers = {}, options?: ExecuteOptions): Promise<ExecuteResult<Result>> {
  const executeId = (options?.executeId ?? `exec#${createId()}`) as ExecuteId;

  loggerPushTags(executeId, {
    from: "execute",
    executeId,
    params,
    path
  });

  const result: any = await _executeCore(path, params, headersInit, {
    ...options,
    onAfterHeaders: (headers) => {
      loggerPushTags(executeId, {
        headers: headers.toJSON()
      });
    }
  });

  loggerPushTags(executeId, { result });
  await loggerSubmit(executeId);

  return result;
}

async function _executeCore<Path extends keyof (typeof schema)["apiMethodsTypeSchema"], Result extends Awaited<ReturnType<(typeof schema)["apiMethodsTypeSchema"][Path]["api"]["action"]>>>(path: Path, params: Parameters<(typeof schema)["apiMethodsTypeSchema"][Path]["api"]["action"]>[0] | string, headersInit: Record<string, string> | Headers = {}, options: ExecuteCoreOptions): Promise<ExecuteResult<Result>> {
  const executeId = options.executeId as ExecuteId;
  runtime.execute.executeIds.add(executeId);

  if (runtime.maxRequest.enable) {
    if (runtime.maxRequest.counter >= runtime.maxRequest.expected) {
      console.log("❌ Loongbao reached the limit of 'maxRequest' in the options and automatically exited.");
      exit(0);
    }
    runtime.maxRequest.counter++;
  }

  if (!(path in schema.apiMethodsSchema)) {
    const result = {
      executeId,
      success: false,
      fail: {
        code: "not-found",
        message: failCode["not-found"](),
        data: undefined
      }
    } satisfies ExecuteResult<Result>;
    runtime.execute.executeIds.delete(executeId);

    return result;
  }

  let headers: Headers;
  if (!(headersInit instanceof Headers)) {
    headers = new Headers({
      ...headersInit
    });
  } else {
    headers = headersInit;
  }

  if (options?.onAfterHeaders) {
    await options.onAfterHeaders(headers);
  }

  const context: Context = {
    executeId,
    path,
    headers,
    detail: options?.detail
  };

  let result: { value: Result };
  try {
    // before execute middleware
    for (const m of _beforeExecuteMiddlewares) {
      await m.middleware(context);
    }

    // check type
    // @ts-ignore
    if (Bun.env.PARAMS_VALIDATE !== "false") _validate(await (await schema.apiValidator.validate[path]()).params(params));

    // execute api
    // @ts-ignore
    const api = schema.apiMethodsSchema[path]();
    const apiModuleAwaited = await api.module;

    const apiMethod = apiModuleAwaited.api.action;

    // @ts-ignore
    result = { value: await apiMethod(params, context) };

    // after execute middleware
    for (const m of _afterExecuteMiddlewares) {
      await m.middleware(context, result);
    }
  } catch (error: any) {
    const errorResult = hanldeCatchError(error, executeId);
    runtime.execute.executeIds.delete(executeId);

    return errorResult;
  }

  runtime.execute.executeIds.delete(executeId);

  return {
    executeId,
    success: true,
    data: result.value
  };
}

export type ExecuteResult<Result> = ExecuteResultSuccess<Result> | ExecuteResultFail;

export type ExecuteResultSuccess<Result> = {
  executeId: ExecuteId;
  success: true;
  data: Result;
};

export type ExecuteResultFail<FailT extends Fail<keyof FailEnumerates> = Fail<keyof FailEnumerates>> = {
  executeId: ExecuteId;
  success: false;
  fail: FailT;
};

export type ExecuteOptions = {
  /**
   * The executeId of the request
   * executeId may be generated by the serverless provider, if not, a random string will be generated instead
   */
  executeId?: string;
  /**
   * Additional information about the request
   * These are usually only fully implemented when called by an HTTP server
   * During testing or when calling between microservices, some or all of the values may be undefined
   */
  detail?: FrameworkContext["detail"];
};

export type ExecuteCoreOptions = ExecuteOptions & {
  onAfterHeaders?: (headers: Headers) => void | Promise<void>;
};
