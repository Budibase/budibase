export type EvalSurface = "automation" | "chat"
export type EvalMode = "smoke" | "full"
export type ToolingProfile = "none" | "tables"

export interface AgentEvalCase {
  id: string
  title: string
  surface: EvalSurface
  tooling: ToolingProfile
  prompt: string
  requiredTools?: string[]
  forbiddenTools?: string[]
  responseMustContain?: string[]
  responseMustNotContain?: string[]
}

export interface EvalModelConfig {
  modelId: string
  provider: "openai" | "mistral"
}

export interface ToolCallSnapshot {
  toolName: string
  state: string
  toolCallId: string
  error?: string
}

export interface NormalizedAgentTrace {
  surface: EvalSurface
  success: boolean
  responseText: string
  error?: string
  latencyMs: number
  usageTotalTokens?: number
  toolCalls: ToolCallSnapshot[]
}

export interface CaseScore {
  pass: boolean
  requiredToolMisses: string[]
  forbiddenToolHits: string[]
  missingRequiredResponseSubstrings: string[]
  forbiddenResponseSubstringsFound: string[]
  incompleteToolCalls: number
  toolErrors: number
  qualityRubricScore: number
}

export interface AgentEvalCaseResult {
  caseId: string
  caseTitle: string
  surface: EvalSurface
  modelId: string
  provider: EvalModelConfig["provider"]
  trace: NormalizedAgentTrace
  score: CaseScore
}

export interface EvalSummary {
  mode: EvalMode
  startedAt: string
  completedAt: string
  durationMs: number
  modelIds: string[]
  totals: {
    cases: number
    passes: number
    failures: number
  }
  metrics: {
    passRate: number
    avgQualityRubricScore: number
    incompleteToolCalls: number
    toolErrors: number
  }
  warnings: string[]
}

export interface EvalReport {
  summary: EvalSummary
  results: AgentEvalCaseResult[]
}
