import * as schema from "../../generate/database-schema";
export declare const useDrizzle: () => Promise<import("drizzle-orm/mysql2").MySql2Database<typeof schema>>;
