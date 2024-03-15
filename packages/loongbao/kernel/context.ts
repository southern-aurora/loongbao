import type { URL } from "node:url";
import type { ExecuteId, Logger, LoongbaoHTTPResponse } from "..";

export type FrameworkContext = {
  path: string;
  executeId: ExecuteId;
  headers: Headers;
  logger: Logger;
  /**
   * Additional information about the request
   * These are usually only fully implemented when called by an HTTP server
   * During testing or when calling between microservices, some or all of the values may be undefined
   */
  detail: Partial<FrameworkHTTPDetail>;
};

export type FrameworkHTTPDetail = {
  path: string;
  executeId: ExecuteId;
  fullurl: URL;
  ip: string;
  request: Request;
  response: LoongbaoHTTPResponse;
};
