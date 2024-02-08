import typia from "typia";
import type * as helloWorld$owo$say2 from "../../../../../src/app/hello-world/owo/say-2";
export default async (params: unknown) => ((input: any): typia.IValidation<Parameters<typeof helloWorld$owo$say2['api']['action']>[0]> => { const validate = (input: any): typia.IValidation<Parameters<typeof helloWorld$owo$say2['api']['action']>[0]> => {
    const errors = [] as any[];
    const __is = (input: any): input is Parameters<typeof helloWorld$owo$say2['api']['action']>[0] => {
        return true;
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Parameters<typeof helloWorld$owo$say2['api']['action']>[0] => {
            return true;
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
}; const prune = (input: Parameters<typeof helloWorld$owo$say2['api']['action']>[0]): void => {
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
