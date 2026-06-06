import type { ReasoningEffort } from "./ai"
import { Document } from "../../"

export const DEFAULT_AGENT_TEST_GROUP_ID = "default"
export const DEFAULT_AGENT_TEST_GROUP_NAME = "Default test group"

export interface AgentTestGroup {
  id: string
  name: string
}

export const buildDefaultAgentTestGroup = (): AgentTestGroup => ({
  id: DEFAULT_AGENT_TEST_GROUP_ID,
  name: DEFAULT_AGENT_TEST_GROUP_NAME,
})

export interface AgentTestReviewer {
  id: string
  type: "exact_match" | "contains_text" | "llm_judge" | "tool_used"
  value: string
}

export interface AgentTestReviewerResult {
  reviewerId: string
  type: AgentTestReviewer["type"]
  status: "passed" | "failed" | "error"
  message?: string
}

export interface AgentTestCaseDefinition {
  id: string
  groupId: string
  name: string
  input: string
  context?: string
  aiConfigIds?: string[]
  reviewers: AgentTestReviewer[]
}

export type AgentTestCaseSnapshot = AgentTestCaseDefinition

export interface AgentTestCase extends AgentTestCaseDefinition {
  lastResults?: AgentTestCaseResult[]
}

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
  groups: AgentTestGroup[]
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
  aiConfigs?: AgentTestModelSnapshot[]
  promptInstructions?: string
  goal?: string
  enabledTools: string[]
  knowledgeBases: string[]
}

export interface AgentTestCaseResult {
  caseId: string
  aiConfigId?: string
  aiConfig?: AgentTestModelSnapshot
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

export type AgentTestRunStatus = "running" | "completed" | "error"

export interface AgentTestRunDocument extends Document {
  agentId: string
  runId: string
  caseIds?: string[]
  status: AgentTestRunStatus
  startedAt: string
  completedAt?: string
  error?: string
}
