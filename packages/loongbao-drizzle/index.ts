/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */

export type DBInsert<Table extends { $inferInsert: Record<string, unknown> }> = Table["$inferInsert"];

export type DBSelect<Table extends { $inferSelect: Record<string, unknown> }> = Table["$inferSelect"];

export type DBPartial<Table extends { $inferSelect: Record<string, unknown> }> = Partial<Table["$inferSelect"]>;

export type DBReplace<Table extends { $inferSelect: Record<string, unknown> }, Replace extends Partial<Record<keyof Table["$inferSelect"], unknown>> = {}> = Replace & Omit<Table["$inferSelect"], keyof Replace>;
