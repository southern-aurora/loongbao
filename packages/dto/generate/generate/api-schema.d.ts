/**
 * ⚠️ This file is generated and modifications will be overwritten
 */
import type * as get from '../src/apps/get';
declare const _default: {
    apiValidator: {
        generatedAt: number;
        validate: {
            get: () => Promise<typeof import("./products/apps/get.ts")>;
        };
    };
    apiMethodsSchema: {
        get: () => {
            module: Promise<typeof get>;
        };
    };
    apiMethodsTypeSchema: {
        get: typeof get;
    };
    apiTestsSchema: {
        get: () => {
            module: Promise<typeof get>;
        };
    };
};
export default _default;
