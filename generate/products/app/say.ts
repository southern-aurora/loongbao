import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as say from "../../../src/app/get";
export const params = async (params: any) => ((input: any): typia.IValidation<Parameters<typeof say['api']['action']>[0]> => { const validate = (input: any): typia.IValidation<Parameters<typeof say['api']['action']>[0]> => {
    const errors = [] as any[];
    const __is = (input: any): input is Parameters<typeof say['api']['action']>[0] => {
        const $io0 = (input: any): boolean => undefined === input.by || "string" === typeof input.by && (2 <= input.by.length && input.by.length <= 16);
        return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Parameters<typeof say['api']['action']>[0] => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.by || "string" === typeof input.by && (2 <= input.by.length || $report(_exceptionable, {
                    path: _path + ".by",
                    expected: "string & MinLength<2>",
                    value: input.by
                })) && (input.by.length <= 16 || $report(_exceptionable, {
                    path: _path + ".by",
                    expected: "string & MaxLength<16>",
                    value: input.by
                })) || $report(_exceptionable, {
                    path: _path + ".by",
                    expected: "((string & MinLength<2> & MaxLength<16>) | undefined)",
                    value: input.by
                })].every((flag: boolean) => flag);
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
}; const prune = (input: Parameters<typeof say['api']['action']>[0]): void => {
    const $po0 = (input: any): any => {
        for (const key of Object.keys(input)) {
            if ("by" === key)
                continue;
            delete input[key];
        }
    };
    if ("object" === typeof input && null !== input)
        $po0(input);
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
export const HTTPResults = async (results: any) => { type T = TSONEncode<ExecuteResultSuccess<Awaited<ReturnType<typeof say['api']['action']>>>>; return ((input: T): string => {
    const $io1 = (input: any): boolean => "string" === typeof input.youSay;
    const $string = (typia.json.stringify as any).string;
    const $so0 = (input: any): any => `{"executeId":${$string(input.executeId)},"success":${input.success},"data":${`{"youSay":${$string((input.data as any).youSay)}}`}}`;
    return $so0(input);
})(results); };
