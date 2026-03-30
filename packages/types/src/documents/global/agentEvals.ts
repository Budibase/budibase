import type { ReasoningEffort } from "./ai"
import { Document } from "../../"

export type AgentEvalReviewer =
  | {
      id: string
      type: "exact_match"
      text: string
    }
  | {
      id: string
      type: "contains_text"
      text: string
    }
  | {
      id: string
      type: "llm_judge"
      rubric: string
    }
  | {
      id: string
      type: "tool_used"
      tool: string
    }

export interface AgentEvalReviewerResult {
  reviewerId: string
  type: AgentEvalReviewer["type"]
  status: "passed" | "failed" | "error"
  message?: string
}

export interface AgentEvalCase {
  id: string
  name: string
  input: string
  context?: string
  reviewers: AgentEvalReviewer[]
}

export interface AgentEvalCaseSnapshot {
  id: string
  name: string
  input: string
  context?: string
  reviewers: AgentEvalReviewer[]
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
  input: string
  context?: string
  caseSnapshot?: AgentEvalCaseSnapshot
  response: string
  status: "passed" | "failed" | "error"
  reviewerResults: AgentEvalReviewerResult[]
  toolCalls: string[]
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
