import { beforeAll } from "bun:test";

beforeAll(async () => {
  // Before all the test starts, load Index.TS and start the HTTP server for testing and use
  await import("../index");
});
