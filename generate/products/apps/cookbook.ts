import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as cookbook from "../../../src/apps/cookbook";
type ParamsT = Parameters<typeof cookbook['api']['action']>[0];
export const params = async (params: any) => ((input: any): typia.IValidation<ParamsT> => { const validate = (input: any): typia.IValidation<ParamsT> => {
    const errors = [] as any[];
    const __is = (input: any): input is ParamsT => {
        return "string" === typeof input && (3 <= input.length && input.length <= 16);
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is ParamsT => {
            return "string" === typeof input && (3 <= input.length || $report(true, {
                path: _path + "",
                expected: "string & MinLength<3>",
                value: input
            })) && (input.length <= 16 || $report(true, {
                path: _path + "",
                expected: "string & MaxLength<16>",
                value: input
            })) || $report(true, {
                path: _path + "",
                expected: "(string & MinLength<3> & MaxLength<16>)",
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
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
