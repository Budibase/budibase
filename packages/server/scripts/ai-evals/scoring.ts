import { AgentEvalCase, CaseScore, NormalizedAgentTrace } from "./types"
import {
  countIncompleteToolCalls,
  countToolErrors,
  estimateQualityRubricScore,
  toLowerTrimmed,
} from "./utils"

function uniqueToolNames(trace: NormalizedAgentTrace): Set<string> {
  return new Set(trace.toolCalls.map(call => call.toolName))
}

function containsSubstring(haystack: string, needle: string): boolean {
  return toLowerTrimmed(haystack).includes(toLowerTrimmed(needle))
}

export function scoreCase({
  testCase,
  trace,
}: {
  testCase: AgentEvalCase
  trace: NormalizedAgentTrace
}): CaseScore {
  const toolNames = uniqueToolNames(trace)

  const requiredToolMisses = (testCase.requiredTools || []).filter(
    tool => !toolNames.has(tool)
  )

  const forbiddenToolHits = (testCase.forbiddenTools || []).filter(tool =>
    toolNames.has(tool)
  )

  const missingRequiredResponseSubstrings = (testCase.responseMustContain || []).filter(
    value => !containsSubstring(trace.responseText, value)
  )

  const forbiddenResponseSubstringsFound = (
    testCase.responseMustNotContain || []
  ).filter(value => containsSubstring(trace.responseText, value))

  const incompleteToolCalls = countIncompleteToolCalls(trace.toolCalls)
  const toolErrors = countToolErrors(trace.toolCalls)

  const qualityRubricScore = estimateQualityRubricScore({
    success: trace.success,
    responseText: trace.responseText,
    missingRequired: missingRequiredResponseSubstrings.length,
    hasForbiddenResponse: forbiddenResponseSubstringsFound.length > 0,
    requiredToolMisses: requiredToolMisses.length,
    forbiddenToolHits: forbiddenToolHits.length,
  })

  const pass =
    trace.success &&
    requiredToolMisses.length === 0 &&
    forbiddenToolHits.length === 0 &&
    missingRequiredResponseSubstrings.length === 0 &&
    forbiddenResponseSubstringsFound.length === 0 &&
    incompleteToolCalls === 0

  return {
    pass,
    requiredToolMisses,
    forbiddenToolHits,
    missingRequiredResponseSubstrings,
    forbiddenResponseSubstringsFound,
    incompleteToolCalls,
    toolErrors,
    qualityRubricScore,
  }
}
