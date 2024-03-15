import { failCode } from "../../../src/fail-code";
import { useLogger, type ExecuteId, type ExecuteResult } from "..";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hanldeCatchError(error: any, executeId: ExecuteId): ExecuteResult<any> {
  const logger = useLogger(executeId);

  logger.error("\nError Data: " + JSON.stringify(error));
  if (error.stack) logger.error("\nError Stack: ", error.stack);
  else logger.error("\nError Stack: ", error);

  if (error.name !== "LoongbaoReject") {
    // If it is not LoongbaoReject, it is considered an internal server error that should not be exposed
    logger.error(`FailCode: internal-server-error`);

    return {
      executeId,
      success: false,
      fail: {
        code: "internal-server-error",
        message: failCode["internal-server-error"](),
        data: undefined
      }
    };
  } else {
    logger.error(`FailCode: ${error.code}`);
    return {
      executeId,
      success: false,
      fail: {
        code: error.code,
        message: error.message,
        data: error.data
      }
    };
  }
}
