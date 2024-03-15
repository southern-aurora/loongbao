import typia from "typia";
import { _validate, type ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as aSandbox$asd from "../../../../src/apps/a-sandbox/asd";
type ParamsT = Parameters<typeof aSandbox$asd['api']['action']>[0];
export const params = async (params: any) => ((input: any): typia.IValidation<ParamsT> => { const validate = (input: any): typia.IValidation<ParamsT> => {
    const errors = [] as any[];
    const __is = (input: any): input is ParamsT => {
        return true;
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is ParamsT => {
            return true;
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
}; const prune = (input: ParamsT): void => {
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
type ResultsT = Awaited<ReturnType<typeof aSandbox$asd['api']['action']>>;
export const results = async (results: any) => { _validate(((input: any): typia.IValidation<TSONEncode<ExecuteResultSuccess<ResultsT>>> => {
    const errors = [] as any[];
    const __is = (input: any): input is TSONEncode<ExecuteResultSuccess<ResultsT>> => {
        const $io0 = (input: any): boolean => "string" === typeof input.executeId && true === input.success && true;
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.validate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is TSONEncode<ExecuteResultSuccess<ResultsT>> => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.executeId || $report(_exceptionable, {
                    path: _path + ".executeId",
                    expected: "string",
                    value: input.executeId
                }), true === input.success || $report(_exceptionable, {
                    path: _path + ".success",
                    expected: "true",
                    value: input.success
                }), true].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "RecursiveObjectXToString<ExecuteResultSuccess<any>, bigint | RegExp | Date | URL | Uint8Array | ArrayBuffer>",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "RecursiveObjectXToString<ExecuteResultSuccess<any>, bigint | RegExp | Date | URL | Uint8Array | ArrayBuffer>",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
})(results)); return ((input: TSONEncode<ExecuteResultSuccess<ResultsT>>): string => {
    const $string = (typia.json.stringify as any).string;
    const $so0 = (input: any): any => `{${undefined === input.data || "function" === typeof input.data ? "" : `"data":${undefined !== input.data ? JSON.stringify(input.data) : undefined},`}"executeId":${$string(input.executeId)},"success":${input.success}}`;
    return $so0(input);
})(results); };
