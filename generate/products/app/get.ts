import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as get from "../../../src/app/get";
export const params = async (params: any) => ((input: any): typia.IValidation<Parameters<typeof get['api']['action']>[0]> => { const validate = (input: any): typia.IValidation<Parameters<typeof get['api']['action']>[0]> => {
    const errors = [] as any[];
    const __is = (input: any): input is Parameters<typeof get['api']['action']>[0] => {
        return null !== input && undefined === input;
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Parameters<typeof get['api']['action']>[0] => {
            return (null !== input || $report(true, {
                path: _path + "",
                expected: "undefined",
                value: input
            })) && (undefined === input || $report(true, {
                path: _path + "",
                expected: "undefined",
                value: input
            }));
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
}; const prune = (input: Parameters<typeof get['api']['action']>[0]): void => {
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
export const HTTPResults = async (results: any) => { type T = TSONEncode<ExecuteResultSuccess<Awaited<ReturnType<typeof get['api']['action']>>>>; return ((input: T): string => {
    const $io1 = (input: any): boolean => "number" === typeof input.total && (Array.isArray(input.list) && input.list.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
    const $io2 = (input: any): boolean => "number" === typeof input.id && "string" === typeof input.title;
    const $string = (typia.json.stringify as any).string;
    const $so0 = (input: any): any => `{"executeId":${$string(input.executeId)},"success":${input.success},"data":${$so1(input.data)}}`;
    const $so1 = (input: any): any => `{"total":${input.total},"list":${`[${input.list.map((elem: any) => `{"id":${(elem as any).id},"title":${$string((elem as any).title)}}`).join(",")}]`}}`;
    return $so0(input);
})(results); };
