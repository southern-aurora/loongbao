/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { configFramework } from "..";
import { _sortMiddleware } from "./middleware";
import { createId } from "@paralleldrive/cuid2";
import schema from "../../../generate/api-schema";
import type { Context } from "../../../src/context";
import { failCode } from "../../../src/fail-code";
import type { FrameworkContext } from "../kernel/context";
import { _afterExecuteMiddlewares, _beforeExecuteMiddlewares } from "../kernel/middleware";
import { type ExecuteId, type Fail, type FailEnumerates, loggerPushTags, loggerSubmit, runtime } from "..";
import { hanldeCatchError } from "../util/handle-catch-error";
import { _validate } from "./validate";
import { exit, nextTick } from "node:process";

export type LoongbaoAppOptions = {
  /**
   * bootstraps
   * @description
   * When Loongbao is launched, all methods in this array will run **in parallel**, usually used to set up middleware.
   */
  bootstraps?: Array<() => void | Promise<void>>;
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
  // eslint-disable-next-line no-console
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

  const bootstraps: Array<Promise<void> | void> = [];
  if (loongbaoAppOptions.bootstraps) {
    for (const bootstrapFunction of loongbaoAppOptions.bootstraps) {
      bootstraps.push(bootstrapFunction());
    }
    await Promise.all(bootstraps);
    await _sortMiddleware();
  }

  return {
    execute: _execute
  };
}

async function _execute<Path extends keyof (typeof schema)["apiMethodsTypeSchema"], Result extends Awaited<ReturnType<(typeof schema)["apiMethodsTypeSchema"][Path]["api"]["action"]>>>(path: Path, params: Parameters<(typeof schema)["apiMethodsTypeSchema"][Path]["api"]["action"]>[0] | string, headersInit: Record<string, string> | Headers = {}, options?: ExecuteApiOptions): Promise<ExecuteResult<Result>> {
  const executeId = (options?.executeId ?? `exec#${createId()}`) as ExecuteId;
  runtime.execute.executeIds.add(executeId);

  if (runtime.maxRequest.enable) {
    if (runtime.maxRequest.counter >= runtime.maxRequest.expected) {
      console.log("❌ Loongbao reached the limit of 'maxRequest' in the options and automatically exited.");
      exit(0);
    }
    runtime.maxRequest.counter++;
  }

  // const onExecutedFinally = async () => {
  //   //
  // };

  if (options?.fromServer !== true) {
    loggerPushTags(executeId, {
      from: "execute",
      executeId,
      params,
      path
    });
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

    if (options?.fromServer !== true) await loggerSubmit(executeId);
    runtime.execute.executeIds.delete(executeId);

    // await onExecutedFinally();

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

  if (options?.fromServer !== true) {
    loggerPushTags(executeId, {
      headers: headers.toJSON()
    });
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
    if (Bun.env.PARAMS_VALIDATE !== "false") _validate(await schema.apiParams.validate[path](params));

    // execute api
    // @ts-ignore
    const api = schema.apiMethodsSchema[path]();
    const apiModuleAwaited = await api.module;

    const apiMethod = apiModuleAwaited.api.action;

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/await-thenable
    result = { value: await apiMethod(params, context) };

    // after execute middleware
    for (const m of _afterExecuteMiddlewares) {
      await m.middleware(context, result);
    }
  } catch (error: any) {
    const errorResult = hanldeCatchError(error, executeId);

    if (options?.fromServer !== true) await loggerSubmit(executeId);
    runtime.execute.executeIds.delete(executeId);

    // await onExecutedFinally();

    return errorResult;
  }

  if (options?.fromServer !== true) {
    loggerPushTags(executeId, {
      success: true,
      result: result.value
    });
  }

  if (options?.fromServer !== true) await loggerSubmit(executeId);
  runtime.execute.executeIds.delete(executeId);

  // await onExecutedFinally();

  return {
    executeId,
    success: true,
    data: result.value
  };
}

export type ExecuteResult<Result> =
  | {
      executeId: ExecuteId;
      success: true;
      data: Result;
    }
  | {
      executeId: ExecuteId;
      success: false;
      fail: Fail<keyof FailEnumerates>;
    };

export type ExecuteApiOptions = {
  /**
   * The executeId of the request
   * executeId may be generated by the serverless provider, if not, a random string will be generated instead
   */
  executeId?: string;
  /**
   * Determine if the invocation of "execute" is from the server.
   * If true, disable certain functions to be implemented by the server itself, such as logging, maxRequest, etc.
   */
  fromServer?: boolean;
  /**
   * Additional information about the request
   * These are usually only fully implemented when called by an HTTP server
   * During testing or when calling between microservices, some or all of the values may be undefined
   */
  detail?: FrameworkContext["detail"];
};
