import { configFramework, defineFail, useLogger } from "..";
import { TSON } from "@southern-aurora/tson";

export type CacheEntity<T> = T;

async function createRedisClient() {
  // node-redis
  const NodeRedis = await import("redis");
  const redisClient = await NodeRedis.createClient({
    url: configFramework.redisUrl
  }).connect();

  // ioredis
  // const IORedis = await import("ioredis");
  // const redisClient = new IORedis.Redis(configFramework.redisUrl, {
  //   disconnectTimeout: 2
  // });
  // redisClient.on("error", (error) => {
  //   const logger = useLogger("global");
  //   logger.error("ioredis error", error);
  // });

  return redisClient;
}

let redisClient: Awaited<ReturnType<typeof createRedisClient>> | undefined;

export async function useRedisClient() {
  if (redisClient === undefined) {
    setTimeout(() => {
      if (redisClient !== undefined) return;
      const logger = useLogger("global");
      logger.error(`redis connect timeout, Are you sure that the REDIS_URL is configured and correct? Your REDIS_URL: ${configFramework.redisUrl}`);
      throw defineFail("internal-server-error", undefined);
    }, 3000);
    redisClient = await createRedisClient();
  }
  return redisClient;
}

export function defineCache<Entity extends CacheEntity<unknown>>(key: string) {
  return {
    async get() {
      const redisClient = await useRedisClient();
      const res = await redisClient.get(`${key}`);
      if (res === null) return undefined;
      return TSON.parse(res) as Entity;
    },
    async set(value: Entity, TTL: number) {
      const redisClient = await useRedisClient();

      // node-redis
      await redisClient.set(`${key}`, TSON.stringify(value), {
        EX: TTL
      });
      // ioredis
      // await redisClient.set(`${key}`, TSON.stringify(value), "EX", TTL);
    },
    async del() {
      const redisClient = await useRedisClient();
      await redisClient.del(`${key}`);
    }
  };
}

export function defineNamespaceCache<Entity extends CacheEntity<unknown>>(key: string) {
  return {
    async get(namespace: string): Promise<Entity | undefined> {
      const redisClient = await useRedisClient();
      const res = await redisClient.get(`${key}:${namespace}`);
      if (res === null) return undefined;
      return TSON.parse(res) as Entity;
    },
    async set(namespace: string, value: Entity, TTL: number) {
      const redisClient = await useRedisClient();

      // node-redis
      await redisClient.set(`${key}:${namespace}`, TSON.stringify(value), {
        EX: TTL
      });
      // ioredis
      // await redisClient.set(`${key}:${namespace}`, TSON.stringify(value), "EX", TTL);
    },
    async del(namespace: string) {
      const redisClient = await useRedisClient();
      await redisClient.del(`${key}:${namespace}`);
    }
  };
}

export function defineResultCache<GetResult extends () => unknown | Promise<unknown>>(key: string, TTL: number, realTTL: number, getResultFn: GetResult, options?: { realGetInterval?: number }) {
  type ResultType = Awaited<ReturnType<GetResult>>;
  const ncache = defineNamespaceCache<{ r: ResultType; t: number }>("bao#result-cache");

  return {
    async getResult(optionsByGetResult?: { force?: boolean; skipCache?: boolean }): Promise<ResultType> {
      if (optionsByGetResult?.skipCache === true) {
        return (await getResultFn()) as ResultType;
      }
      let result = await ncache.get(key);
      if (result) {
        if (!optionsByGetResult?.force && result.t > Math.ceil(new Date().getTime() / 1000)) {
          return result.r;
        }
        const ncacheLock = defineNamespaceCache<boolean>("bao#result-cache-lock");
        const lock = await ncacheLock.get(key);
        if (lock === true) {
          return result.r;
        }
        await ncacheLock.set(key, true, options?.realGetInterval ?? 6);
      }
      result = { r: (await getResultFn()) as ResultType, t: Math.ceil(new Date().getTime() / 1000) + TTL };
      await ncache.set(key, result, TTL + realTTL + (options?.realGetInterval ?? 6));

      return result.r;
    }
  };
}
