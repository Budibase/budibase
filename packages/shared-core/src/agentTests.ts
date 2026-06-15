import type {
  AgentTestCaseDefinition,
  AgentTestCaseSnapshot,
  AgentTestReviewer,
} from "@budibase/types"

export type ReviewerType = AgentTestReviewer["type"]

export interface ReviewerEvaluateContext {
  response: string
  toolCalls: string[]
  selectedOperationId?: string
  selectedOperationName?: string
  operationNamesById?: Record<string, string>
}

export interface ReviewerEvaluation {
  passed: boolean
  message: string
}

export interface ReviewerDefinition {
  label: string
  description: string
  inputType: "input" | "textarea" | "select"
  requiredMessage: string
  evaluate:
    | ((
        reviewer: AgentTestReviewer,
        ctx: ReviewerEvaluateContext
      ) => ReviewerEvaluation)
    | "async"
}

const getOperationLabel = (
  operationId: string,
  operationNamesById?: Record<string, string>
) => operationNamesById?.[operationId] || operationId

export const REVIEWERS: Record<ReviewerType, ReviewerDefinition> = {
  exact_match: {
    label: "Exact match",
    description: "Require the final response to exactly match some text.",
    inputType: "textarea",
    requiredMessage: "exact match text is required",
    evaluate: (r, { response }) => {
      const passed = response === r.value
      return {
        passed,
        message: passed
          ? `Matched exactly "${r.value}".`
          : `Expected the final response to exactly match "${r.value}".`,
      }
    },
  },
  contains_text: {
    label: "Contains text",
    description: "Require the final response to include some text.",
    inputType: "input",
    requiredMessage: "contains text is required",
    evaluate: (r, { response }) => {
      const passed = response.includes(r.value)
      return {
        passed,
        message: passed
          ? `Found "${r.value}" in the final response.`
          : `Expected the final response to include "${r.value}".`,
      }
    },
  },
  llm_judge: {
    label: "LLM judge",
    description: "Grade the response against a free-form rubric.",
    inputType: "textarea",
    requiredMessage: "judge rubric is required",
    evaluate: "async",
  },
  tool_used: {
    label: "Tool used",
    description: "Pass when a specific tool was used during the run.",
    inputType: "select",
    requiredMessage: "tool name is required",
    evaluate: (r, { toolCalls }) => {
      const passed = toolCalls.includes(r.value)
      return {
        passed,
        message: passed
          ? `Tool "${r.value}" was used.`
          : `Expected tool "${r.value}" to be used.`,
      }
    },
  },
  operation_used: {
    label: "Operation used",
    description: "Pass when a specific operation was selected for the run.",
    inputType: "select",
    requiredMessage: "operation is required",
    evaluate: (r, {
      selectedOperationId,
      selectedOperationName,
      operationNamesById,
    }) => {
      const passed = selectedOperationId === r.value
      const expectedOperationLabel = getOperationLabel(
        r.value,
        operationNamesById
      )
      const selectedOperationLabel =
        selectedOperationId &&
        (selectedOperationName ||
          getOperationLabel(selectedOperationId, operationNamesById))
      return {
        passed,
        message: passed
          ? `Operation "${expectedOperationLabel}" was used.`
          : selectedOperationLabel
            ? `Expected operation "${expectedOperationLabel}" to be used, but "${selectedOperationLabel}" was selected.`
            : `Expected operation "${expectedOperationLabel}" to be used.`,
      }
    },
  },
}

export const REVIEWER_TYPES = Object.keys(REVIEWERS) as ReviewerType[]

export const readReviewerContent = (reviewer: AgentTestReviewer): string =>
  reviewer.value

export const writeReviewerContent = (
  reviewer: AgentTestReviewer,
  value: string
): AgentTestReviewer => ({ ...reviewer, value })

export const createReviewer = (
  type: ReviewerType,
  id: string,
  value = ""
): AgentTestReviewer => ({ id, type, value })

export const describeReviewer = (
  reviewer: AgentTestReviewer
): string | undefined => readReviewerContent(reviewer) || undefined

export const validateReviewer = (reviewer: AgentTestReviewer): string | null =>
  readReviewerContent(reviewer)
    ? null
    : REVIEWERS[reviewer.type].requiredMessage

export const getReviewerLabel = (type: ReviewerType): string =>
  REVIEWERS[type].label

export const buildAgentTestCaseSnapshot = (
  testCase: AgentTestCaseDefinition
): AgentTestCaseSnapshot => ({
  id: testCase.id,
  groupId: testCase.groupId,
  name: testCase.name,
  input: testCase.input,
  context: testCase.context,
  aiConfigIds: testCase.aiConfigIds,
  reviewers: testCase.reviewers,
})
