import type { JSONValue } from "../core"
import type { FunctionQueryCapability, UserBindings } from "../documents"

export enum FunctionErrorCode {
  FUNCTIONS_DISABLED = "FUNCTIONS_DISABLED",
  FUNCTION_COMPILE_ERROR = "FUNCTION_COMPILE_ERROR",
  FUNCTION_COMPILE_TIMEOUT = "FUNCTION_COMPILE_TIMEOUT",
  FUNCTION_BUILD_REQUIRED = "FUNCTION_BUILD_REQUIRED",
  FUNCTION_BUILD_FAILED = "FUNCTION_BUILD_FAILED",
  FUNCTION_RUNTIME_ERROR = "FUNCTION_RUNTIME_ERROR",
  FUNCTION_TIMEOUT = "FUNCTION_TIMEOUT",
  FUNCTION_MEMORY_LIMIT = "FUNCTION_MEMORY_LIMIT",
  FUNCTION_QUERY_DENIED = "FUNCTION_QUERY_DENIED",
  FUNCTION_QUERY_LIMIT = "FUNCTION_QUERY_LIMIT",
  FUNCTION_OUTPUT_INVALID = "FUNCTION_OUTPUT_INVALID",
  FUNCTION_RUNNER_BUSY = "FUNCTION_RUNNER_BUSY",
  FUNCTION_RUNNER_UNAVAILABLE = "FUNCTION_RUNNER_UNAVAILABLE",
  FUNCTION_ORCHESTRATOR_INTERRUPTED = "FUNCTION_ORCHESTRATOR_INTERRUPTED",
  FUNCTION_PROTOCOL_ERROR = "FUNCTION_PROTOCOL_ERROR",
}

export interface FunctionError {
  code: FunctionErrorCode
  message: string
  line?: number
  column?: number
}

export interface FunctionCompileLimits {
  maxSourceBytes: number
  timeoutMs: number
  memoryLimitMb: number
}

export interface FunctionRunLimits {
  maxInputBytes: number
  maxInputDepth: number
  isolateMemoryLimitMb: number
  timeoutMs: number
  maxQueryCalls: number
  maxConcurrentQueryCalls: number
  maxQueryResponseBytes: number
  maxQueryResponseDepth: number
  maxOutputBytes: number
  maxOutputDepth: number
  maxLogEntries: number
  maxLogBytes: number
  maxLogEntryBytes: number
}

export interface FunctionServiceLimits {
  maxConcurrentRuns: number
  maxRunSummaryErrorMessageLength: number
  maxRunSummaryBytes: number
}

export interface FunctionLimits {
  compile: FunctionCompileLimits
  run: FunctionRunLimits
  service: FunctionServiceLimits
}

export const DEFAULT_FUNCTION_LIMITS: FunctionLimits = {
  compile: {
    maxSourceBytes: 256 * 1024,
    timeoutMs: 5_000,
    memoryLimitMb: 256,
  },
  run: {
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
  service: {
    maxConcurrentRuns: 4,
    maxRunSummaryErrorMessageLength: 512,
    maxRunSummaryBytes: 8 * 1024,
  },
}

export interface FunctionArtifact {
  compiledJavaScript: string
  sourceMap?: string
  sourceHash: string
  declarationsHash: string
  compiledAt: string
}

export type FunctionRunStatus = "success" | "error" | "stopped"

export type FunctionLogLevel = "debug" | "info" | "warn" | "error"

export interface FunctionLogEntry {
  level: FunctionLogLevel
  message: string
  timestamp: string
}

export interface FunctionRunMetrics {
  durationMs: number
  queryCount: number
  outputBytes: number
  logBytes: number
}

export interface FunctionRunRequest {
  runId: string
  artifact: FunctionArtifact
  inputs: Record<string, JSONValue>
  grantToken: string
  limits: FunctionRunLimits
}

export interface FunctionRunResult {
  runId: string
  status: FunctionRunStatus
  output?: Record<string, JSONValue>
  logs?: FunctionLogEntry[]
  metrics: FunctionRunMetrics
  error?: FunctionError
}

export interface FunctionExecutorHealth {
  healthy: boolean
}

export interface FunctionExecutor {
  health: () => Promise<FunctionExecutorHealth>
  execute: (request: FunctionRunRequest) => Promise<FunctionRunResult>
  terminate: (runId: string) => Promise<void>
}

export interface FunctionQueryBrokerRequest {
  runId: string
  capabilityId: string
  parameters: Record<string, string | null>
  grantToken: string
}

export interface FunctionQueryBrokerResponse {
  data: JSONValue
}

export interface FunctionRunGrant {
  runId: string
  workspaceId: string
  functionId: string
  sourceHash: string
  automationId: string
  automationStepId: string
  executionUser?: UserBindings
  capabilities: Record<string, FunctionQueryCapability>
  remainingQueryCalls: number
  limits: FunctionRunLimits
  expiresAt: number
}
