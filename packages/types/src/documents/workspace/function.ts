import type { FunctionArtifact, FunctionErrorCode } from "../../sdk/functions"
import type { Document } from "../document"

export interface FunctionQueryCapability {
  capabilityId: string
  queryId: string
  datasourceAlias: string
  queryAlias: string
  parameterNames: string[]
}

export interface FunctionBuildDiagnostic {
  code: string
  message: string
  line?: number
  column?: number
}

export interface FunctionBuildAttempt {
  status: "success" | "failed"
  sourceHash: string
  declarationsHash: string
  attemptedAt: string
  diagnostics?: FunctionBuildDiagnostic[]
}

export interface FunctionDocument extends Document {
  _id: string
  name: string
  appId: string
  source: string
  capabilities: FunctionQueryCapability[]
  artifact?: FunctionArtifact
  lastBuild?: FunctionBuildAttempt
  createdAt: string
  updatedAt: string
}

export type FunctionEnvironment = "development" | "published"

export type FunctionRunSummaryStatus =
  | "running"
  | "success"
  | "error"
  | "stopped"

export interface FunctionRunSummary extends Document {
  _id: string
  runId: string
  functionId: string
  functionName: string
  sourceHash: string
  environment: FunctionEnvironment
  status: FunctionRunSummaryStatus
  invocation: {
    type: "automation"
    automationId: string
    stepId: string
  }
  startedAt: string
  finishedAt?: string
  durationMs?: number
  queryCount: number
  error?: {
    code: FunctionErrorCode
    message: string
  }
}
