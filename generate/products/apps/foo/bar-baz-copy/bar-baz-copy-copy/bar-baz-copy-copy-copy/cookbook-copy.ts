import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as foo$barBazCopy$barBazCopyCopy$barBazCopyCopyCopy$cookbookCopy from "../../../../../../../src/apps/foo/bar-baz-copy/bar-baz-copy-copy/bar-baz-copy-copy-copy/cookbook-copy";
type ParamsT = Parameters<typeof foo$barBazCopy$barBazCopyCopy$barBazCopyCopyCopy$cookbookCopy['api']['action']>[0];
export const params = async (params: any) => ((input: any): typia.IValidation<ParamsT> => { const validate = (input: any): typia.IValidation<ParamsT> => {
    const errors = [] as any[];
    const __is = (input: any): input is ParamsT => {
        return "string" === typeof input;
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is ParamsT => {
            return "string" === typeof input || $report(true, {
                path: _path + "",
                expected: "string",
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
