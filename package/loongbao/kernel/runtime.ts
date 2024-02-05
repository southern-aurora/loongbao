import { type ExecuteId } from "..";

export const runtime = {
  httpServer: {
    executeIds: new Set<ExecuteId>()
  },
  execute: {
    executeIds: new Set<ExecuteId>()
  }
};
