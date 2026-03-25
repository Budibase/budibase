import { Document } from "../../"

export interface AgentEvalAssertions {
  exact?: string
  contains?: string[]
  notContains?: string[]
}

export interface AgentEvalCase {
  id: string
  name: string
  prompt: string
  assertions: AgentEvalAssertions
}

export interface AgentEvalSuite extends Document {
  agentId: string
  cases: AgentEvalCase[]
  updatedBy?: string
}

export interface AgentEvalAssertionFailure {
  type: "exact" | "contains" | "notContains" | "invalid"
  message: string
}

export interface AgentEvalCaseResult {
  caseId: string
  name: string
  prompt: string
  response: string
  status: "passed" | "failed" | "error"
  failures: AgentEvalAssertionFailure[]
  sessionId: string
  requestIds: string[]
  startedAt: string
  completedAt: string
  durationMs: number
  error?: string
}

export interface AgentEvalRun extends Document {
  agentId: string
  runId: string
  total: number
  passed: number
  failed: number
  startedAt: string
  completedAt: string
  results: AgentEvalCaseResult[]
}
