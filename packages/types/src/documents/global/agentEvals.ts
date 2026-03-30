import type { ReasoningEffort } from "./ai"
import { Document } from "../../"

export interface AgentEvalAssertions {
  exact?: string
  contains?: string[]
  notContains?: string[]
  judge?: AgentEvalJudgeAssertion
}

export interface AgentEvalJudgeAssertion {
  rubric: string
}

export interface AgentEvalCase {
  id: string
  name: string
  prompt: string
  assertions: AgentEvalAssertions
}

export interface AgentEvalCaseSnapshot {
  id: string
  name: string
  prompt: string
  assertions: AgentEvalAssertions
}

export interface AgentEvalModelSnapshot {
  aiConfigId: string
  name?: string
  provider?: string
  model?: string
  liteLLMModelId?: string
  reasoningEffort?: ReasoningEffort
}

export interface AgentEvalSuite extends Document {
  agentId: string
  cases: AgentEvalCase[]
  updatedBy?: string
}

export interface AgentEvalAssertionFailure {
  type: "exact" | "contains" | "notContains" | "judge" | "invalid"
  message: string
}

export interface AgentEvalJudgeResult {
  status: "passed" | "failed" | "error"
  reason?: string
  error?: string
}

export interface AgentEvalSnapshot {
  agentId: string
  agentName: string
  agentRev?: string
  agentUpdatedAt?: string
  suiteRev?: string
  aiconfig: string
  aiConfig?: AgentEvalModelSnapshot
  promptInstructions?: string
  goal?: string
  enabledTools: string[]
  knowledgeBases: string[]
}

export interface AgentEvalCaseResult {
  caseId: string
  name: string
  prompt: string
  caseSnapshot?: AgentEvalCaseSnapshot
  response: string
  status: "passed" | "failed" | "error"
  failures: AgentEvalAssertionFailure[]
  judge?: AgentEvalJudgeResult
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
  snapshot: AgentEvalSnapshot
  results: AgentEvalCaseResult[]
}
