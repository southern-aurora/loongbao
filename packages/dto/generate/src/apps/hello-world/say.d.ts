import type typia from "typia";
/**
 * This is an API that greets you!
 * 🌟 These ~~comments~~ will be presented by the **Cookbook**
 */
export declare const api: {
    meta: {};
    action(params: {
        by?: string & typia.tags.MinLength<2> & typia.tags.MaxLength<16>;
    }, context: import("loongbao").FrameworkContext): {
        youSay: string;
    };
} & {
    isApi: true;
};
export declare const test: {
    getCases: () => import("loongbao").ApiTestCases<{
        meta: {};
        action(params: {
            by?: string & typia.tags.MinLength<2> & typia.tags.MaxLength<16>;
        }, context: import("loongbao").FrameworkContext): {
            youSay: string;
        };
    } & {
        isApi: true;
    }>[];
    isApiTest: boolean;
};
