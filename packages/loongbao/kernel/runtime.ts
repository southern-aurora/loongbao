import { type ExecuteId } from "..";

export const runtime = {
  httpServer: {
    executeIds: new Set<ExecuteId>()
  },
  execute: {
    executeIds: new Set<ExecuteId>()
  },
  maxRequest: {
    enable: false,
    counter: 0,
    expected: 0
  },
  maxRunningTimeout: {
    enable: false,
    expectedEndedAt: 0
  }
};
