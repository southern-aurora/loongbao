module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "prettier"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "curly": "off",
        "quotes": "off",
        "no-empty": "off",
        "no-console": "error",
        "default-case-last": "off",
        "no-useless-return": "off",
        "@typescript-eslint/quotes": "off",
        "@typescript-eslint/return-await": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-throw-literal": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/prefer-ts-expect-error": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/no-explicit-any": ["error", { "ignoreRestArgs": false }],
        "@typescript-eslint/array-type": ["warn", { "default": "generic", "readonly": "generic" }],
    }
}