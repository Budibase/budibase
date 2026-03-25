import { AgentEvalRun, AgentEvalSuite } from "../../../documents"

export interface FetchAgentEvalSuiteResponse {
  suite: AgentEvalSuite
  latestRun: AgentEvalRun | null
}

export interface UpdateAgentEvalSuiteRequest {
  _rev?: string
  cases: AgentEvalSuite["cases"]
}

export type UpdateAgentEvalSuiteResponse = AgentEvalSuite

export interface RunAgentEvalSuiteResponse {
  run: AgentEvalRun
}
