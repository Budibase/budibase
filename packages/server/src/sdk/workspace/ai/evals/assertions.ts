import type {
  AgentEvalAssertionFailure,
  AgentEvalAssertions,
  AgentEvalCase,
  AgentEvalJudgeAssertion,
} from "@budibase/types"

const normalizeText = (value?: string) => {
  return value?.trim().replace(/\s+/g, " ").toLowerCase() || ""
}

export const normalizeAssertions = (
  assertions: AgentEvalAssertions
): AgentEvalAssertions => {
  const exact = assertions.exact?.trim()
  const contains = (assertions.contains || [])
    .map(value => value.trim())
    .filter(Boolean)
  const notContains = (assertions.notContains || [])
    .map(value => value.trim())
    .filter(Boolean)
  const judge = normalizeJudgeAssertion(assertions.judge)

  return {
    ...(exact ? { exact } : {}),
    ...(contains.length > 0 ? { contains } : {}),
    ...(notContains.length > 0 ? { notContains } : {}),
    ...(judge ? { judge } : {}),
  }
}

export const normalizeJudgeAssertion = (
  judge?: AgentEvalJudgeAssertion
): AgentEvalJudgeAssertion | undefined => {
  const rubric = judge?.rubric?.trim()
  if (!rubric) {
    return undefined
  }

  return { rubric }
}

export const validateEvalCase = (
  testCase: AgentEvalCase
): AgentEvalAssertionFailure[] => {
  const failures: AgentEvalAssertionFailure[] = []
  const assertions = normalizeAssertions(testCase.assertions)

  if (!testCase.name) {
    failures.push({
      type: "invalid",
      message: "Case name is required.",
    })
  }

  if (!testCase.prompt) {
    failures.push({
      type: "invalid",
      message: "Prompt is required.",
    })
  }

  if (
    !(
      assertions.exact ||
      assertions.contains?.length ||
      assertions.notContains?.length ||
      assertions.judge?.rubric
    )
  ) {
    failures.push({
      type: "invalid",
      message:
        "At least one assertion is required. Add an exact, contains, not-contains, or judge check.",
    })
  }

  return failures
}

export const evaluateResponse = ({
  assertions,
  response,
}: {
  assertions: AgentEvalAssertions
  response: string
}): AgentEvalAssertionFailure[] => {
  const failures: AgentEvalAssertionFailure[] = []
  const normalizedAssertions = normalizeAssertions(assertions)
  const normalizedResponse = normalizeText(response)

  if (
    normalizedAssertions.exact &&
    normalizedResponse !== normalizeText(normalizedAssertions.exact)
  ) {
    failures.push({
      type: "exact",
      message: `Expected the response to exactly match "${normalizedAssertions.exact}".`,
    })
  }

  for (const expected of normalizedAssertions.contains || []) {
    if (!normalizedResponse.includes(normalizeText(expected))) {
      failures.push({
        type: "contains",
        message: `Expected the response to include "${expected}".`,
      })
    }
  }

  for (const forbidden of normalizedAssertions.notContains || []) {
    if (normalizedResponse.includes(normalizeText(forbidden))) {
      failures.push({
        type: "notContains",
        message: `Expected the response to not include "${forbidden}".`,
      })
    }
  }

  return failures
}
