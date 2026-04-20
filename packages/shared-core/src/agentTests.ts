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
  create: (id: string) => ReviewerOfType<T>
  normalize: (reviewer: ReviewerOfType<T>) => ReviewerOfType<T>
  describe: (reviewer: ReviewerOfType<T>) => string | undefined
  // Returns an error message if invalid, otherwise null
  validate: (reviewer: ReviewerOfType<T>) => string | null
  // "async" = evaluated via an external judge (see runJudge in the SDK)
  evaluate:
    | ((
        reviewer: ReviewerOfType<T>,
        ctx: ReviewerEvaluateContext
      ) => ReviewerEvaluation)
    | "async"
}

export const normalizeResponseText = (value?: string) =>
  value?.trim().replace(/\s+/g, " ").toLowerCase() || ""

const trimContent = <T extends ReviewerType>(
  reviewer: ReviewerOfType<T>,
  field: ContentField<T>
): ReviewerOfType<T> => ({
  ...reviewer,
  [field]: (reviewer[field] as unknown as string).trim(),
})

const describeContent = <T extends ReviewerType>(
  reviewer: ReviewerOfType<T>,
  field: ContentField<T>
): string | undefined => {
  const value = (reviewer[field] as unknown as string) ?? ""
  return value.trim() || undefined
}

const requireContent = <T extends ReviewerType>(
  reviewer: ReviewerOfType<T>,
  field: ContentField<T>,
  message: string
): string | null =>
  (reviewer[field] as unknown as string).trim() ? null : message

export const REVIEWERS: { [T in ReviewerType]: ReviewerDefinition<T> } = {
  exact_match: {
    label: "Exact match",
    description: "Require the final response to exactly match some text.",
    contentField: "text",
    inputKind: "textarea",
    create: id => ({ id, type: "exact_match", text: "" }),
    normalize: r => trimContent(r, "text"),
    describe: r => describeContent(r, "text"),
    validate: r => requireContent(r, "text", "exact match text is required"),
    evaluate: (r, { response }) => {
      const passed =
        normalizeResponseText(response) === normalizeResponseText(r.text)
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
    create: id => ({ id, type: "contains_text", text: "" }),
    normalize: r => trimContent(r, "text"),
    describe: r => describeContent(r, "text"),
    validate: r => requireContent(r, "text", "contains text is required"),
    evaluate: (r, { response }) => {
      const passed = normalizeResponseText(response).includes(
        normalizeResponseText(r.text)
      )
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
    create: id => ({ id, type: "llm_judge", rubric: "" }),
    normalize: r => trimContent(r, "rubric"),
    describe: r => describeContent(r, "rubric"),
    validate: r => requireContent(r, "rubric", "judge rubric is required"),
    evaluate: "async",
  },
  tool_used: {
    label: "Tool used",
    description: "Pass when a specific tool was used during the run.",
    contentField: "tool",
    inputKind: "select",
    create: id => ({ id, type: "tool_used", tool: "" }),
    normalize: r => trimContent(r, "tool"),
    describe: r => describeContent(r, "tool"),
    validate: r => requireContent(r, "tool", "tool name is required"),
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

// Dispatch helper that preserves the correlation between reviewer.type and the
// definition's generic parameter. One cast in one place so call sites stay typed.
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

export const normalizeReviewer = (
  reviewer: AgentTestReviewer
): AgentTestReviewer =>
  withReviewerDefinition(reviewer, (def, r) => def.normalize(r))

export const normalizeReviewers = (
  reviewers: AgentTestReviewer[]
): AgentTestReviewer[] => reviewers.map(normalizeReviewer)

export const describeReviewer = (
  reviewer: AgentTestReviewer
): string | undefined =>
  withReviewerDefinition(reviewer, (def, r) => def.describe(r))

export const validateReviewer = (
  reviewer: AgentTestReviewer
): string | null =>
  withReviewerDefinition(reviewer, (def, r) => def.validate(r))

export const getReviewerLabel = (type: ReviewerType): string =>
  REVIEWERS[type].label

export const normalizeCaseContext = (context?: string) => {
  const normalized = context?.trim()
  return normalized ? normalized : undefined
}
