export declare const failCode: {
    "network-error": () => string;
    "internal-server-error": () => string;
    "not-found": () => string;
    "not-allow-method": () => string;
    "general-type-safe-error": (p: {
        path: string;
        expected: string;
        value: string;
    }) => string;
    "business-fail": (message: string) => string;
};
