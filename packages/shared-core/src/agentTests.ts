import type { AgentTestReviewer } from "@budibase/types"

export type ReviewerType = AgentTestReviewer["type"]

export type ReviewerOfType<T extends ReviewerType> = Extract<
  AgentTestReviewer,
  { type: T }
>

type ContentField<T extends ReviewerType> = Exclude<
  keyof ReviewerOfType<T>,
  "id" | "type"
>

export interface ReviewerEvaluateContext {
  response: string
  toolCalls: string[]
}

export interface ReviewerEvaluation {
  passed: boolean
  message: string
}

export interface ReviewerDefinition<T extends ReviewerType> {
  label: string
  description: string
  contentField: ContentField<T>
  inputKind: "input" | "textarea" | "select"
  requiredMessage: string
  create: (id: string) => ReviewerOfType<T>
  evaluate:
    | ((
        reviewer: ReviewerOfType<T>,
        ctx: ReviewerEvaluateContext
      ) => ReviewerEvaluation)
    | "async"
}

function reviewerContent(reviewer: AgentTestReviewer): string {
  switch (reviewer.type) {
    case "exact_match":
    case "contains_text":
      return reviewer.text
    case "llm_judge":
      return reviewer.rubric
    case "tool_used":
      return reviewer.tool
  }
}

export const REVIEWERS: { [T in ReviewerType]: ReviewerDefinition<T> } = {
  exact_match: {
    label: "Exact match",
    description: "Require the final response to exactly match some text.",
    contentField: "text",
    inputKind: "textarea",
    requiredMessage: "exact match text is required",
    create: id => ({ id, type: "exact_match", text: "" }),
    evaluate: (r, { response }) => {
      const passed = response === r.text
      return {
        passed,
        message: passed
          ? `Matched exactly "${r.text}".`
          : `Expected the final response to exactly match "${r.text}".`,
      }
    },
  },
  contains_text: {
    label: "Contains text",
    description: "Require the final response to include some text.",
    contentField: "text",
    inputKind: "input",
    requiredMessage: "contains text is required",
    create: id => ({ id, type: "contains_text", text: "" }),
    evaluate: (r, { response }) => {
      const passed = response.includes(r.text)
      return {
        passed,
        message: passed
          ? `Found "${r.text}" in the final response.`
          : `Expected the final response to include "${r.text}".`,
      }
    },
  },
  llm_judge: {
    label: "LLM judge",
    description: "Grade the response against a free-form rubric.",
    contentField: "rubric",
    inputKind: "textarea",
    requiredMessage: "judge rubric is required",
    create: id => ({ id, type: "llm_judge", rubric: "" }),
    evaluate: "async",
  },
  tool_used: {
    label: "Tool used",
    description: "Pass when a specific tool was used during the run.",
    contentField: "tool",
    inputKind: "select",
    requiredMessage: "tool name is required",
    create: id => ({ id, type: "tool_used", tool: "" }),
    evaluate: (r, { toolCalls }) => {
      const passed = toolCalls.includes(r.tool)
      return {
        passed,
        message: passed
          ? `Tool "${r.tool}" was used.`
          : `Expected tool "${r.tool}" to be used.`,
      }
    },
  },
}

export const REVIEWER_TYPES = Object.keys(REVIEWERS) as ReviewerType[]

export function withReviewerDefinition<R>(
  reviewer: AgentTestReviewer,
  fn: <T extends ReviewerType>(
    def: ReviewerDefinition<T>,
    r: ReviewerOfType<T>
  ) => R
): R {
  const def = REVIEWERS[reviewer.type] as ReviewerDefinition<ReviewerType>
  return (fn as (def: unknown, r: AgentTestReviewer) => R)(def, reviewer)
}

export const describeReviewer = (
  reviewer: AgentTestReviewer
): string | undefined => {
  const v = reviewerContent(reviewer)
  return v || undefined
}

export const validateReviewer = (reviewer: AgentTestReviewer): string | null => {
  const def = REVIEWERS[reviewer.type]
  const v = reviewerContent(reviewer)
  return v ? null : def.requiredMessage
}

export const getReviewerLabel = (type: ReviewerType): string =>
  REVIEWERS[type].label
