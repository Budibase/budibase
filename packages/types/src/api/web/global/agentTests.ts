import {
  AgentTestCaseDefinition,
  AgentTestGroup,
  AgentTestRun,
  AgentTestSuite,
} from "../../../documents"

export interface FetchAgentTestSuiteResponse {
  suite: AgentTestSuite
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
}

export interface RunAgentTestSuiteResponse {
  run: AgentTestRun
}
