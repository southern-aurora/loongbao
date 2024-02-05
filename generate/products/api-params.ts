/**
 * ⚠️This file is generated and modifications will be overwritten
 */
import typia from 'typia';
import type * as helloWorld$say2 from "../../src/app/hello-world/say-2";
import type * as helloWorld$say from "../../src/app/hello-world/say";
export default {
    validate: {
        'hello-world/say-2': async (params: unknown) => ((input: any): typia.IValidation<Parameters<typeof helloWorld$say2['api']['action']>[0]> => {
            const errors = [] as any[];
            const __is = (input: any, _exceptionable: boolean = true): input is Parameters<typeof helloWorld$say2['api']['action']>[0] => {
                const $io0 = (input: any, _exceptionable: boolean = true): boolean => (undefined === input.by || "string" === typeof input.by && /^[a-z]*$/.test(input.by)) && (0 === Object.keys(input).length || Object.keys(input).every((key: any) => {
                    if (["by"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return false;
                }));
                return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input, true);
            };
            if (false === __is(input)) {
                const $report = (typia.validateEquals as any).report(errors);
                ((input: any, _path: string, _exceptionable: boolean = true): input is Parameters<typeof helloWorld$say2['api']['action']>[0] => {
                    const $join = (typia.validateEquals as any).join;
                    const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.by || "string" === typeof input.by && (/^[a-z]*$/.test(input.by) || $report(_exceptionable, {
                            path: _path + ".by",
                            expected: "string & Pattern<\"^[a-z]*$\">",
                            value: input.by
                        })) || $report(_exceptionable, {
                            path: _path + ".by",
                            expected: "((string & Pattern<\"^[a-z]*$\">) | undefined)",
                            value: input.by
                        }), 0 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                            if (["by"].some((prop: any) => key === prop))
                                return true;
                            const value = input[key];
                            if (undefined === value)
                                return true;
                            return $report(_exceptionable, {
                                path: _path + $join(key),
                                expected: "undefined",
                                value: value
                            });
                        }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
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
        })(params),
        'hello-world/say': async (params: unknown) => ((input: any): typia.IValidation<Parameters<typeof helloWorld$say['api']['action']>[0]> => {
            const errors = [] as any[];
            const __is = (input: any, _exceptionable: boolean = true): input is Parameters<typeof helloWorld$say['api']['action']>[0] => {
                const $io0 = (input: any, _exceptionable: boolean = true): boolean => (undefined === input.by || "string" === typeof input.by && /^[a-z]*$/.test(input.by)) && (0 === Object.keys(input).length || Object.keys(input).every((key: any) => {
                    if (["by"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return false;
                }));
                return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input, true);
            };
            if (false === __is(input)) {
                const $report = (typia.validateEquals as any).report(errors);
                ((input: any, _path: string, _exceptionable: boolean = true): input is Parameters<typeof helloWorld$say['api']['action']>[0] => {
                    const $join = (typia.validateEquals as any).join;
                    const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.by || "string" === typeof input.by && (/^[a-z]*$/.test(input.by) || $report(_exceptionable, {
                            path: _path + ".by",
                            expected: "string & Pattern<\"^[a-z]*$\">",
                            value: input.by
                        })) || $report(_exceptionable, {
                            path: _path + ".by",
                            expected: "((string & Pattern<\"^[a-z]*$\">) | undefined)",
                            value: input.by
                        }), 0 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                            if (["by"].some((prop: any) => key === prop))
                                return true;
                            const value = input[key];
                            if (undefined === value)
                                return true;
                            return $report(_exceptionable, {
                                path: _path + $join(key),
                                expected: "undefined",
                                value: value
                            });
                        }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
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
        })(params),
    },
};
