import type { LoongbaoFailCode } from "loongbao";

export const failCode = {
  "network-error": () => "Network Error",
  "internal-server-error": () => "Internal Server Error",
  "not-found": () => "Not Found",
  "not-allow-method": () => "Not Allow Method",
  "general-type-safe-error": (p: { path: string; expected: string; value: string }) => `Parameter Error: The current value is '${p.value}', which does not meet '${p.expected}' requirements`,
  "business-fail": (message: string) => `${message}`
  // You can add your own mistakes here
  // ...
} satisfies LoongbaoFailCode;
