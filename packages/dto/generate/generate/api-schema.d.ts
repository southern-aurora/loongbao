/**
 * ⚠️ This file is generated and modifications will be overwritten
 */
import type * as appBbb from '../src/apps/app-bbb';
import type * as cookbook from '../src/apps/cookbook';
import type * as helloWorld$say from '../src/apps/hello-world/say';
declare const _default: {
    apiValidator: {
        generatedAt: number;
        validate: {
            'app-bbb': () => Promise<typeof import("./products/apps/app-bbb.ts")>;
            cookbook: () => Promise<typeof import("./products/apps/cookbook.ts")>;
            'hello-world/say': () => Promise<typeof import("./products/apps/hello-world/say.ts")>;
        };
    };
    apiMethodsSchema: {
        'app-bbb': () => {
            module: Promise<typeof appBbb>;
        };
        cookbook: () => {
            module: Promise<typeof cookbook>;
        };
        'hello-world/say': () => {
            module: Promise<typeof helloWorld$say>;
        };
    };
    apiMethodsTypeSchema: {
        'app-bbb': typeof appBbb;
        cookbook: typeof cookbook;
        'hello-world/say': typeof helloWorld$say;
    };
    apiTestsSchema: {
        'hello-world/say': () => {
            module: Promise<typeof helloWorld$say>;
        };
    };
};
export default _default;
