import { type MiddlewareOptions } from "..";

export function defineMiddleware(options: MiddlewareOptions): () => MiddlewareOptions & { isMiddleware: true } {
  return () => ({
    ...options,
    isMiddleware: true
  });
}
