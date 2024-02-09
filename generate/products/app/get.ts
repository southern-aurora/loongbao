import typia from "typia";
import { ExecuteResultSuccess } from "loongbao";
import { type TSONEncode } from "@southern-aurora/tson";
import type * as get from "../../../src/app/get";
type ParamsT = Parameters<typeof get['api']['action']>[0];
export const params = async (params: any) => ((input: any): typia.IValidation<ParamsT> => { const validate = (input: any): typia.IValidation<ParamsT> => {
    const errors = [] as any[];
    const __is = (input: any): input is ParamsT => {
        const $io0 = (input: any): boolean => (undefined === input.hello || "world" === input.hello) && (undefined === input.by || "string" === typeof input.by && (2 <= input.by.length && input.by.length <= 16));
        return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is ParamsT => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.hello || "world" === input.hello || $report(_exceptionable, {
                    path: _path + ".hello",
                    expected: "(\"world\" | undefined)",
                    value: input.hello
                }), undefined === input.by || "string" === typeof input.by && (2 <= input.by.length || $report(_exceptionable, {
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
}; const prune = (input: ParamsT): void => {
    const $po0 = (input: any): any => {
        for (const key of Object.keys(input)) {
            if ("hello" === key || "by" === key)
                continue;
            delete input[key];
        }
    };
    if ("object" === typeof input && null !== input)
        $po0(input);
}; const output = validate(input); if (output.success)
    prune(input); return output; })(params);
export const paramsSchema = {
    schemas: [
        {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        hello: {
                            type: "string",
                            "enum": [
                                "world"
                            ]
                        },
                        by: {
                            type: "string",
                            maxLength: 16,
                            minLength: 2
                        }
                    },
                    nullable: false
                }
            },
            nullable: false,
            required: [
                "data"
            ]
        }
    ],
    components: {
        schemas: {}
    },
    purpose: "swagger",
    surplus: false
};
type HTTPResultsT = Awaited<ReturnType<typeof get['api']['action']>>;
export const HTTPResults = async (results: any) => { return ((input: TSONEncode<ExecuteResultSuccess<HTTPResultsT>>): string => {
    const $io1 = (input: any): boolean => "string" === typeof input.youSay;
    const $string = (typia.json.stringify as any).string;
    const $so0 = (input: any): any => `{"executeId":${$string(input.executeId)},"success":${input.success},"data":${`{"youSay":${$string((input.data as any).youSay)}}`}}`;
    return $so0(input);
})(results); };
