import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as helloWorld$foo from "../../../../src/app/hello-world/foo";
export const params = async (params: any) => ((input: any): typia.IValidation<Parameters<typeof helloWorld$foo['api']['action']>[0]> => { const validate = (input: any): typia.IValidation<Parameters<typeof helloWorld$foo['api']['action']>[0]> => {
    const errors = [] as any[];
    const __is = (input: any): input is Parameters<typeof helloWorld$foo['api']['action']>[0] => {
        return true;
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Parameters<typeof helloWorld$foo['api']['action']>[0] => {
            return true;
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
}; const prune = (input: Parameters<typeof helloWorld$foo['api']['action']>[0]): void => {
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
export const HTTPResults = async (results: any) => { type T = TSONEncode<ExecuteResultSuccess<Awaited<ReturnType<typeof helloWorld$foo['api']['action']>>>>; return ((input: T): string => {
    const $string = (typia.json.stringify as any).string;
    const $so0 = (input: any): any => `{${undefined === input.data || "function" === typeof input.data ? "" : `"data":${undefined !== input.data ? JSON.stringify(input.data) : undefined},`}"executeId":${$string(input.executeId)},"success":${input.success}}`;
    return $so0(input);
})(results); };
