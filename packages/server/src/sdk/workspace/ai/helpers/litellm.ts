import { AIConfigType, ReasoningEffort } from "@budibase/types"

export type BuildLiteLLMParamsArgs = {
  provider: string
  name: string
  credentialFields: Record<string, string>
  configType: AIConfigType
  reasoningEffort?: ReasoningEffort
}

type ReasoningRule = {
  normalizeEffort?: (args: BuildLiteLLMParamsArgs) => string | undefined
  extraBody?: (
    args: BuildLiteLLMParamsArgs,
    effort: string
  ) => Record<string, unknown> | undefined
}

type LiteLLMParamBuilder = (
  params: Record<string, unknown>,
  args: BuildLiteLLMParamsArgs
) => Record<string, unknown>

const reasoningRules: Record<string, ReasoningRule> = {
  groq: {
    normalizeEffort: ({ name }) =>
      name.toLowerCase().includes("qwen3-32b") ? "default" : undefined,
  },
  openrouter: {
    extraBody: () => ({ include_reasoning: true }),
  },
}

const normalizeReasoningEffort = (args: BuildLiteLLMParamsArgs) => {
  if (!args.reasoningEffort) {
    return undefined
  }

  const rule = reasoningRules[args.provider]
  return rule?.normalizeEffort?.(args) ?? args.reasoningEffort
}

const applyBaseParams: LiteLLMParamBuilder = (params, args) => ({
  ...params,
  custom_llm_provider: args.provider,
  model: `${args.provider}/${args.name}`,
  use_in_pass_through: false,
  use_litellm_proxy: false,
  merge_reasoning_content_in_choices: true,
  drop_params: true,
  input_cost_per_token: 0,
  output_cost_per_token: 0,
  guardrails: [],
})

const applyCredentialParams: LiteLLMParamBuilder = (params, args) => ({
  ...params,
  ...args.credentialFields,
})

const applyReasoningParams: LiteLLMParamBuilder = (params, args) => {
  // We don't want to do this when configuring embeddings
  if (args.configType !== AIConfigType.COMPLETIONS) {
    return params
  }

  const normalizedReasoningEffort = normalizeReasoningEffort(args)
  if (!normalizedReasoningEffort) {
    return params
  }

  const rule = reasoningRules[args.provider]
  const extraBody = rule?.extraBody?.(args, normalizedReasoningEffort)
  const baseExtraBody =
    typeof params.extra_body === "object" && params.extra_body !== null
      ? (params.extra_body as Record<string, unknown>)
      : {}

  return {
    ...params,
    reasoning_effort: normalizedReasoningEffort,
    ...(extraBody && { extra_body: { ...baseExtraBody, ...extraBody } }),
  }
}

const buildLiteLLMParamsPipeline = [
  applyBaseParams,
  applyCredentialParams,
  applyReasoningParams,
]

export const buildLiteLLMParams = (args: BuildLiteLLMParamsArgs) => {
  return buildLiteLLMParamsPipeline.reduce<Record<string, unknown>>(
    (params, builder) => builder(params, args),
    {}
  )
}
