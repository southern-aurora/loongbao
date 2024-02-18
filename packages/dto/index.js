// packages/dto/generate/src/fail-code.ts
var failCode = {
  "network-error": () => "Network Error",
  "internal-server-error": () => "Internal Server Error",
  "not-found": () => "Not Found",
  "not-allow-method": () => "Not Allow Method",
  "general-type-safe-error": (p) => `Parameter Error: The current value is '${p.value}', which does not meet '${p.expected}' requirements`,
  "business-fail": (message) => `${message}`
};

// packages/dto/index.ts
var FailCode = failCode;
export {
  FailCode
};
