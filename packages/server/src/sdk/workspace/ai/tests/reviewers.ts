import type {
  AgentTestCase,
  AgentTestReviewer,
  AgentTestReviewerResult,
} from "@budibase/types"

interface AgentTestValidationFailure {
  message: string
}

export const normalizeResponseText = (value?: string) => {
  return value?.trim().replace(/\s+/g, " ").toLowerCase() || ""
}

export const normalizeReviewer = (
  reviewer: AgentTestReviewer
): AgentTestReviewer => {
  switch (reviewer.type) {
    case "exact_match":
    case "contains_text":
      return {
        ...reviewer,
        text: reviewer.text.trim(),
      }
    case "llm_judge":
      return {
        ...reviewer,
        rubric: reviewer.rubric.trim(),
      }
    case "tool_used":
      return {
        ...reviewer,
        tool: reviewer.tool.trim(),
      }
  }
}

export const normalizeReviewers = (
  reviewers: AgentTestReviewer[]
): AgentTestReviewer[] => {
  return reviewers.map(normalizeReviewer)
}

export const normalizeCaseContext = (context?: string) => {
  const normalized = context?.trim()
  return normalized ? normalized : undefined
}

export const validateTestCase = (
  testCase: AgentTestCase
): AgentTestValidationFailure[] => {
  const failures: AgentTestValidationFailure[] = []
  const reviewers = normalizeReviewers(testCase.reviewers)

  if (!testCase.name?.trim()) {
    failures.push({
      message: "Test name is required.",
    })
  }

  if (!testCase.input?.trim()) {
    failures.push({
      message: "Input is required.",
    })
  }

  if (!reviewers.length) {
    failures.push({
      message: "At least one reviewer is required.",
    })
  }

  reviewers.forEach((reviewer, index) => {
    const reviewerNumber = index + 1

    switch (reviewer.type) {
      case "exact_match":
        if (!reviewer.text) {
          failures.push({
            message: `Reviewer ${reviewerNumber} exact match text is required.`,
          })
        }
        return
      case "contains_text":
        if (!reviewer.text) {
          failures.push({
            message: `Reviewer ${reviewerNumber} contains text is required.`,
          })
        }
        return
      case "llm_judge":
        if (!reviewer.rubric) {
          failures.push({
            message: `Reviewer ${reviewerNumber} judge rubric is required.`,
          })
        }
        return
      case "tool_used":
        if (!reviewer.tool) {
          failures.push({
            message: `Reviewer ${reviewerNumber} tool name is required.`,
          })
        }
        return
    }
  })

  return failures
}

export const evaluateReviewer = ({
  reviewer,
  response,
  toolCalls,
}: {
  reviewer: Exclude<AgentTestReviewer, { type: "llm_judge" }>
  response: string
  toolCalls: string[]
}): AgentTestReviewerResult => {
  const normalizedResponse = normalizeResponseText(response)

  switch (reviewer.type) {
    case "exact_match":
      return {
        reviewerId: reviewer.id,
        type: reviewer.type,
        status:
          normalizedResponse === normalizeResponseText(reviewer.text)
            ? "passed"
            : "failed",
        message:
          normalizedResponse === normalizeResponseText(reviewer.text)
            ? `Matched exactly "${reviewer.text}".`
            : `Expected the final response to exactly match "${reviewer.text}".`,
      }
    case "contains_text":
      return {
        reviewerId: reviewer.id,
        type: reviewer.type,
        status: normalizedResponse.includes(
          normalizeResponseText(reviewer.text)
        )
          ? "passed"
          : "failed",
        message: normalizedResponse.includes(
          normalizeResponseText(reviewer.text)
        )
          ? `Found "${reviewer.text}" in the final response.`
          : `Expected the final response to include "${reviewer.text}".`,
      }
    case "tool_used":
      return {
        reviewerId: reviewer.id,
        type: reviewer.type,
        status: toolCalls.includes(reviewer.tool) ? "passed" : "failed",
        message: toolCalls.includes(reviewer.tool)
          ? `Tool "${reviewer.tool}" was used.`
          : `Expected tool "${reviewer.tool}" to be used.`,
      }
  }
}

export const buildErroredReviewerResults = ({
  reviewers,
  message,
}: {
  reviewers: AgentTestReviewer[]
  message: string
}): AgentTestReviewerResult[] => {
  return reviewers.map(reviewer => ({
    reviewerId: reviewer.id,
    type: reviewer.type,
    status: "error",
    message,
  }))
}

export const getCaseStatus = (
  reviewerResults: AgentTestReviewerResult[]
): "passed" | "failed" | "error" => {
  if (reviewerResults.some(result => result.status === "error")) {
    return "error"
  }
  if (reviewerResults.some(result => result.status === "failed")) {
    return "failed"
  }
  return "passed"
}
