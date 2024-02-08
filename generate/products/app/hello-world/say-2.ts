import typia from "typia";
import type * as helloWorld$say2 from "../../../../src/app/hello-world/say-2";
export default async (params: unknown) => ((input: any): typia.IValidation<Parameters<typeof helloWorld$say2['api']['action']>[0]> => { const validate = (input: any): typia.IValidation<Parameters<typeof helloWorld$say2['api']['action']>[0]> => {
    const errors = [] as any[];
    const __is = (input: any): input is Parameters<typeof helloWorld$say2['api']['action']>[0] => {
        const $io0 = (input: any): boolean => undefined === input.by || "string" === typeof input.by && /^[a-z]*$/.test(input.by);
        return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Parameters<typeof helloWorld$say2['api']['action']>[0] => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.by || "string" === typeof input.by && (/^[a-z]*$/.test(input.by) || $report(_exceptionable, {
                    path: _path + ".by",
                    expected: "string & Pattern<\"^[a-z]*$\">",
                    value: input.by
                })) || $report(_exceptionable, {
                    path: _path + ".by",
                    expected: "((string & Pattern<\"^[a-z]*$\">) | undefined)",
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
}; const prune = (input: Parameters<typeof helloWorld$say2['api']['action']>[0]): void => {
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
