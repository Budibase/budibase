import { AgentTestRun, AgentTestSuite } from "../../../documents"

export interface FetchAgentTestSuiteResponse {
  suite: AgentTestSuite
}

export interface UpdateAgentTestSuiteRequest {
  _rev?: string
  cases: AgentTestSuite["cases"]
}

export type UpdateAgentTestSuiteResponse = AgentTestSuite

export interface RunAgentTestSuiteRequest {
  caseId?: string
}

export interface RunAgentTestSuiteResponse {
  run: AgentTestRun
}
