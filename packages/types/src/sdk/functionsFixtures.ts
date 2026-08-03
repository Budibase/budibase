import type { FunctionRunRequest, FunctionRunResult } from "./functions"

export const FUNCTION_RUN_REQUEST_FIXTURE: FunctionRunRequest = {
  runId: "run-fixture-1",
  artifact: {
    compiledJavaScript: "export default async function run() { return {} }",
    sourceMap: "{}",
    sourceHash: "source-hash-fixture",
    declarationsHash: "declarations-hash-fixture",
    compiledAt: "2026-01-01T00:00:00.000Z",
  },
  inputs: {
    message: "hello",
    count: 1,
    enabled: true,
    nested: { value: null },
  },
  grantToken: "grant-token-fixture",
  limits: {
    maxInputBytes: 256 * 1024,
    maxInputDepth: 20,
    isolateMemoryLimitMb: 64,
    timeoutMs: 30_000,
    maxQueryCalls: 10,
    maxConcurrentQueryCalls: 2,
    maxQueryResponseBytes: 1024 * 1024,
    maxQueryResponseDepth: 30,
    maxOutputBytes: 1024 * 1024,
    maxOutputDepth: 30,
    maxLogEntries: 100,
    maxLogBytes: 64 * 1024,
    maxLogEntryBytes: 4 * 1024,
  },
}

export const FUNCTION_RUN_RESULT_FIXTURE: FunctionRunResult = {
  runId: "run-fixture-1",
  status: "success",
  output: {
    message: "hello",
  },
  logs: [
    {
      level: "info",
      message: "fixture log",
      timestamp: "2026-01-01T00:00:01.000Z",
    },
  ],
  metrics: {
    durationMs: 10,
    queryCount: 0,
    outputBytes: 19,
    logBytes: 11,
  },
}
