import {
  AgentTestCaseDefinition,
  AgentTestGroup,
  AgentTestRunDocument,
  AgentTestSuite,
} from "../../../documents"

export interface FetchAgentTestSuiteResponse {
  suite: AgentTestSuite
  activeRun?: AgentTestRunDocument
}

export interface UpdateAgentTestSuiteRequest {
  _rev?: string
  groups: AgentTestGroup[]
  cases: AgentTestCaseDefinition[]
}

export type UpdateAgentTestSuiteResponse = AgentTestSuite

export interface RunAgentTestSuiteRequest {
  caseId?: string
  groupId?: string
  aiConfigIds?: string[]
}

export interface RunAgentTestSuiteResponse {
  runId: string
  status: AgentTestRunDocument["status"]
}

export interface FetchAgentTestRunResponse {
  run: AgentTestRunDocument
}
