import type { ReasoningEffort } from "./ai"
import { Document } from "../../"

export type AgentTestReviewer =
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

export interface AgentTestReviewerResult {
  reviewerId: string
  type: AgentTestReviewer["type"]
  status: "passed" | "failed" | "error"
  message?: string
}

export interface AgentTestCase {
  id: string
  name: string
  input: string
  context?: string
  reviewers: AgentTestReviewer[]
}

export type AgentTestCaseSnapshot = AgentTestCase

export interface AgentTestModelSnapshot {
  aiConfigId: string
  name?: string
  provider?: string
  model?: string
  liteLLMModelId?: string
  reasoningEffort?: ReasoningEffort
}

export interface AgentTestSuite extends Document {
  agentId: string
  cases: AgentTestCase[]
  updatedBy?: string
}

export interface AgentTestSnapshot {
  agentId: string
  agentName: string
  agentRev?: string
  agentUpdatedAt?: string
  suiteRev?: string
  aiconfig: string
  aiConfig?: AgentTestModelSnapshot
  promptInstructions?: string
  goal?: string
  enabledTools: string[]
  knowledgeBases: string[]
}

export interface AgentTestCaseResult {
  caseId: string
  name: string
  caseSnapshot: AgentTestCaseSnapshot
  response: string
  status: "passed" | "failed" | "error"
  reviewerResults: AgentTestReviewerResult[]
  toolCalls: string[]
  sessionId: string
  requestIds: string[]
  startedAt: string
  completedAt: string
  durationMs: number
  error?: string
}

export interface AgentTestRun {
  agentId: string
  runId: string
  total: number
  passed: number
  failed: number
  startedAt: string
  completedAt: string
  snapshot: AgentTestSnapshot
  results: AgentTestCaseResult[]
}
