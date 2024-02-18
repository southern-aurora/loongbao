import type typia from "typia";
export declare const api: {
    cookbook: string;
    meta: {};
    action(params: {
        hello?: "world";
        by?: string & typia.tags.MinLength<2> & typia.tags.MaxLength<16>;
    }, context: import("loongbao").FrameworkContext): {
        youSay: string;
    };
} & {
    isApi: true;
};
export declare const test: {
    getCases: () => import("loongbao").ApiTestCases<{
        cookbook: string;
        meta: {};
        action(params: {
            hello?: "world";
            by?: string & typia.tags.MinLength<2> & typia.tags.MaxLength<16>;
        }, context: import("loongbao").FrameworkContext): {
            youSay: string;
        };
    } & {
        isApi: true;
    }>[];
    isApiTest: boolean;
};
