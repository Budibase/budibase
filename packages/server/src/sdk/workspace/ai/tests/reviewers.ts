import type {
  AgentTestCaseDefinition,
  AgentTestReviewer,
  AgentTestReviewerResult,
} from "@budibase/types"
import {
  REVIEWERS,
  validateReviewer,
  type ReviewerDefinition,
} from "@budibase/shared-core"

interface AgentTestValidationFailure {
  message: string
}

export const validateTestCase = (
  testCase: AgentTestCaseDefinition
): AgentTestValidationFailure[] => {
  const failures: AgentTestValidationFailure[] = []
  const reviewers = testCase.reviewers

  if (!testCase.name.trim()) {
    failures.push({ message: "Test name is required." })
  }
  if (!testCase.input.trim()) {
    failures.push({ message: "Input is required." })
  }
  if (!reviewers.length) {
    failures.push({ message: "At least one reviewer is required." })
  }

  reviewers.forEach((reviewer, index) => {
    const error = validateReviewer(reviewer)
    if (error) {
      failures.push({ message: `Reviewer ${index + 1} ${error}.` })
    }
  })

  return failures
}

export const evaluateReviewer = ({
  reviewer,
  response,
  toolCalls,
  selectedOperationId,
  selectedOperationName,
  operationNamesById,
}: {
  reviewer: AgentTestReviewer
  response: string
  toolCalls: string[]
  selectedOperationId?: string
  selectedOperationName?: string
  operationNamesById?: Record<string, string>
}): AgentTestReviewerResult => {
  const def: ReviewerDefinition = REVIEWERS[reviewer.type]
  if (def.evaluate === "async") {
    throw new Error(`${reviewer.type} cannot be evaluated synchronously`)
  }

  const { passed, message } = def.evaluate(reviewer, {
    response,
    toolCalls,
    selectedOperationId,
    selectedOperationName,
    operationNamesById,
  })
  return {
    reviewerId: reviewer.id,
    type: reviewer.type,
    status: passed ? "passed" : "failed",
    message,
  }
}

export const buildErroredReviewerResults = ({
  reviewers,
  message,
}: {
  reviewers: AgentTestReviewer[]
  message: string
}): AgentTestReviewerResult[] =>
  reviewers.map(reviewer => ({
    reviewerId: reviewer.id,
    type: reviewer.type,
    status: "error",
    message,
  }))

export const getCaseStatus = (
  reviewerResults: AgentTestReviewerResult[]
): "passed" | "failed" | "error" => {
  if (reviewerResults.some(r => r.status === "error")) return "error"
  if (reviewerResults.some(r => r.status === "failed")) return "failed"
  return "passed"
}
