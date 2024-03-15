import type { IValidation } from "typia";
import { reject } from "../kernel/fail";

export function _validate(validator: IValidation.IFailure | IValidation.ISuccess): void {
  if (validator.success) return;
  const error = validator.errors[0];

  throw reject("general-type-safe-error", {
    path: error.path,
    expected: error.expected,
    value: error.value
  });
}
