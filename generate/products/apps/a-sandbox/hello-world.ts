import typia from "typia";
import { _validate, type ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as aSandbox$helloWorld from "../../../../src/apps/a-sandbox/hello-world";
type ParamsT = Parameters<typeof aSandbox$helloWorld['api']['action']>[0];
export const params = async (params: any) => ((input: any): typia.IValidation<ParamsT> => { const validate = (input: any): typia.IValidation<ParamsT> => {
    const errors = [] as any[];
    const __is = (input: any): input is ParamsT => {
        return "object" === typeof input && null !== input && true;
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is ParamsT => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => true;
            return ("object" === typeof input && null !== input && false === Array.isArray(input) || $report(true, {
                path: _path + "",
                expected: "__type",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "__type",
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
}; const prune = (input: ParamsT): void => {
    const $po0 = (input: any): any => {
        for (const key of Object.keys(input))
            delete input[key];
    };
    if ("object" === typeof input && null !== input)
        $po0(input);
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
type ResultsT = Awaited<ReturnType<typeof aSandbox$helloWorld['api']['action']>>;
export const results = async (results: any) => { _validate(((input: any): typia.IValidation<TSONEncode<ExecuteResultSuccess<ResultsT>>> => {
    const errors = [] as any[];
    const __is = (input: any): input is TSONEncode<ExecuteResultSuccess<ResultsT>> => {
        const $io0 = (input: any): boolean => "string" === typeof input.executeId && true === input.success && ("object" === typeof input.data && null !== input.data && "string" === typeof (input.data as any).say);
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
                }), ("object" === typeof input.data && null !== input.data || $report(_exceptionable, {
                    path: _path + ".data",
                    expected: "RecursiveObjectXToString<__object, bigint | RegExp | Date | URL | Uint8Array | ArrayBuffer>",
                    value: input.data
                })) && $vo1(input.data, _path + ".data", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".data",
                    expected: "RecursiveObjectXToString<__object, bigint | RegExp | Date | URL | Uint8Array | ArrayBuffer>",
                    value: input.data
                })].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.say || $report(_exceptionable, {
                    path: _path + ".say",
                    expected: "string",
                    value: input.say
                })].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "RecursiveObjectXToString<ExecuteResultSuccess<__object>, bigint | RegExp | Date | URL | Uint8Array | ArrayBuffer>",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "RecursiveObjectXToString<ExecuteResultSuccess<__object>, bigint | RegExp | Date | URL | Uint8Array | ArrayBuffer>",
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
    const $io1 = (input: any): boolean => "string" === typeof input.say;
    const $string = (typia.json.stringify as any).string;
    const $so0 = (input: any): any => `{"executeId":${$string(input.executeId)},"success":${input.success},"data":${`{"say":${$string((input.data as any).say)}}`}}`;
    return $so0(input);
})(results); };
