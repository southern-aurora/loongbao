import { failCode } from "./generate/src/fail-code";
import type _ApiSchema from "./generate/generate/api-schema.d.ts";
export type ApiSchema = typeof _ApiSchema;
export declare const FailCode: {
    "network-error": () => string;
    "internal-server-error": () => string;
    "not-found": () => string;
    "not-allow-method": () => string;
    "general-type-safe-error": (p: {
        path: string;
        expected: string;
        value: string;
    }) => string;
    "business-fail": (message: string) => string;
};
export type ExecutePath = keyof ApiSchema["apiMethodsSchema"];
export type ExecuteParams<Path extends keyof ApiSchema["apiMethodsSchema"]> = Awaited<Parameters<ApiSchema["apiMethodsTypeSchema"][Path]["api"]["action"]>[0]>;
export type ExecuteResult<Path extends keyof ApiSchema["apiMethodsTypeSchema"]> = {
    success: true;
    data: Awaited<ReturnType<ApiSchema["apiMethodsTypeSchema"][Path]["api"]["action"]>>;
} | {
    success: false;
    fail: Fail<keyof typeof failCode>;
};
export type ExecuteMethodResult<Path extends keyof ApiSchema["apiMethodsTypeSchema"]> = Awaited<ReturnType<ApiSchema["apiMethodsTypeSchema"][Path]["api"]["action"]>>;
export type Fail<FailCode extends keyof typeof failCode> = {
    code: FailCode;
    message: string;
    data: Parameters<(typeof failCode)[FailCode]>[0];
};
