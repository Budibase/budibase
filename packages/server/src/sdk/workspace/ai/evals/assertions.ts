import type {
  AgentEvalAssertionFailure,
  AgentEvalAssertions,
  AgentEvalCase,
} from "@budibase/types"

export const validateEvalCase = (
  testCase: AgentEvalCase
): AgentEvalAssertionFailure[] => {
  const failures: AgentEvalAssertionFailure[] = []

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
      testCase.assertions?.exact ||
      testCase.assertions?.contains?.length ||
      testCase.assertions?.notContains?.length
    )
  ) {
    failures.push({
      type: "invalid",
      message:
        "At least one assertion is required. Add an exact, contains, or not-contains check.",
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

  if (assertions.exact && response !== assertions.exact) {
    failures.push({
      type: "exact",
      message: `Expected the response to exactly match "${assertions.exact}".`,
    })
  }

  for (const expected of assertions.contains || []) {
    if (!response.includes(expected)) {
      failures.push({
        type: "contains",
        message: `Expected the response to include "${expected}".`,
      })
    }
  }

  for (const forbidden of assertions.notContains || []) {
    if (response.includes(forbidden)) {
      failures.push({
        type: "notContains",
        message: `Expected the response to not include "${forbidden}".`,
      })
    }
  }

  return failures
}
