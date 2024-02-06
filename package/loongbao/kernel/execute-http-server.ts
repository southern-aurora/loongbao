/* eslint-disable no-console */
import { createId } from "@paralleldrive/cuid2";
import { _afterHTTPRequestMiddlewares, _beforeHTTPResponseMiddlewares, configFramework, loggerPushTags, loggerSubmit, useLogger, loggerSubmitAll, runtime } from "..";
import schema from "../../../generate/api-schema";
import { routerHandler } from "../../../src/router";
import { failCode } from "../../../src/fail-code";
import type { ExecuteId, HTTPRequest, HTTPResponse, LoongbaoApp } from "..";
import { hanldeCatchError } from "../util/handle-catch-error";
import process, { exit } from "node:process";
import { TSON } from "@southern-aurora/tson";

export type ExecuteHttpServerOptions = {
  /**
   * The execution ID generator
   * If you have enabled this option, the executeId will be generated each time by calling this method. Otherwise, it will be generated using the built-in method.
   *
   * @param request
   * @returns
   */
  executeIdGenerator?: (request: HTTPRequest) => string | Promise<string>;
};

export async function executeHttpServer(app: LoongbaoApp, options: ExecuteHttpServerOptions = {}) {
  // If an unexpected error occurs, exit the process.
  // For modern production environments such as Serverless, Kubernetes, or Docker Compose:
  // The process will automatically restart after exiting.
  // This helps prevent unexpected errors from contaminating the entire application and causing subsequent requests to fail intermittently.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("uncaughtException", async (error) => {
    const logger = useLogger("global");
    logger.error("ErrorCaughtInUncaughtExceptionEvent:", error);
    await loggerSubmitAll();
    exit(1);
  });

  const server = Bun.serve({
    port: configFramework.port,
    async fetch(request: HTTPRequest) {
      const fullurl = new URL(request.url, `http://${request.headers.get("host") ?? "localhost"}`);
      const executeId = (options?.executeIdGenerator ? await options.executeIdGenerator(request) : `exec#${createId()}`) as ExecuteId;
      runtime.httpServer.executeIds.add(executeId);
      const ip = (request.headers.get("x-forwarded-for") as string | undefined)?.split(",")[0] ?? "0.0.0.0";
      const headers = request.headers;

      loggerPushTags(executeId, {
        from: "http-server",
        fullUrl: fullurl.pathname,
        ip,
        method: request.method,
        requestHeaders: request.headers.toJSON(),
        timein: new Date().getTime()
      });

      const response: HTTPResponse = {
        body: "",
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": configFramework.corsAllowMethods ?? "*",
          "Access-Control-Allow-Headers": configFramework.corsAllowHeaders ?? "*",
          "Access-Control-Allow-Origin": configFramework.corsAllowOrigin ?? "*"
        }
      };

      try {
        // Process OPTIONS pre inspection requests
        if (request.method === "OPTIONS") {
          await loggerSubmit(executeId);
          runtime.httpServer.executeIds.delete(executeId);

          return new Response("", {
            headers: {
              "Access-Control-Allow-Methods": configFramework.corsAllowMethods ?? "*",
              "Access-Control-Allow-Headers": configFramework.corsAllowHeaders ?? "*",
              "Access-Control-Allow-Origin": configFramework.corsAllowOrigin ?? "*"
            }
          });
        }

        let path = fullurl.pathname.substring(1).split("/");

        // Compatible with API gateway's ability to differentiate versions by path
        // see: /src/config/ConfigProgram.ts in "ignorePathLevel"
        if (configFramework.ignorePathLevel !== 0) path = path.slice(configFramework.ignorePathLevel);

        let pathstr = path.join("/") as keyof (typeof schema)["apiMethodsSchema"];

        // Special processing: do not run middleware when encountering 404 and return quickly
        if (!(pathstr in schema.apiMethodsSchema)) {
          const redirectPath = await routerHandler(pathstr, fullurl);
          if (!redirectPath) {
            const rawbody = await request.text();
            loggerPushTags(executeId, {
              body: rawbody || "no body"
            });
            response.body = TSON.stringify({
              executeId,
              success: false,
              fail: {
                code: "not-found",
                message: failCode["not-found"](),
                data: undefined
              }
            });

            loggerPushTags(executeId, {
              status: response.status,
              responseHeaders: response.headers,
              timeout: new Date().getTime()
            });

            await loggerSubmit(executeId);
            runtime.httpServer.executeIds.delete(executeId);

            return new Response(response.body, response);
          }
          pathstr = redirectPath;
        }

        loggerPushTags(executeId, {
          path: pathstr
        });

        const detail = {
          path: pathstr,
          ip,
          executeId,
          fullurl,
          request,
          response
        };

        // execute api
        // after request middleware
        for (const m of _afterHTTPRequestMiddlewares) {
          await m.middleware(headers, detail);
        }

        const rawbody = await request.text();
        loggerPushTags(executeId, {
          body: rawbody || "no body"
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let params: any;
        if (rawbody === "") {
          params = undefined;
        } else {
          try {
            params = TSON.parse(rawbody);
          } catch (error) {
            const logger = useLogger(executeId);
            logger.log("TIP: body is not json, the content is not empty, but the content is not in a valid JSON format. The original content value can be retrieved via request.text()");
            params = undefined;
          }
        }

        loggerPushTags(executeId, {
          params
        });

        const result = await app.execute(pathstr, params, headers, {
          executeId,
          detail,
          fromServer: true
        });

        if (response.body === "") {
          response.body = response.body + TSON.stringify(result);
        } else if (response.body === undefined || response.body === null) {
          response.body = "";
        }

        // before response middleware
        const middlewareResponse = {
          value: response.body
        };
        for (const m of _beforeHTTPResponseMiddlewares) {
          await m.middleware(middlewareResponse, detail);
        }

        response.body = middlewareResponse.value;
      } catch (error) {
        const result = hanldeCatchError(error, executeId);
        response.body = TSON.stringify(result);
      }

      loggerPushTags(executeId, {
        status: response.status,
        responseHeaders: response.headers,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        body: response.body || "no body",
        timeout: new Date().getTime()
      });

      await loggerSubmit(executeId);
      runtime.httpServer.executeIds.delete(executeId);

      return new Response(response.body, response);
    },
    async error(error) {
      return new Response(TSON.stringify(hanldeCatchError(error, "global")), {
        status: 200
      });
    }
  });

  // eslint-disable-next-line no-console
  console.log(`🧊 Http server started at :`, configFramework.port);

  return {
    server,
    stop: server.stop
  };
}
