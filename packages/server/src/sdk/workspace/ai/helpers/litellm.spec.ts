import { AIConfigType } from "@budibase/types"
import { buildLiteLLMParams } from "./litellm"

describe("buildLiteLLMParams", () => {
  const baseArgs = {
    provider: "openai",
    name: "gpt-5-mini",
    credentialFields: { api_key: "secret" },
    configType: AIConfigType.COMPLETIONS,
  }

  it("includes base params and credentials", () => {
    const result = buildLiteLLMParams(baseArgs)

    expect(result).toMatchObject({
      custom_llm_provider: "openai",
      model: "openai/gpt-5-mini",
      use_in_pass_through: false,
      use_litellm_proxy: false,
      merge_reasoning_content_in_choices: true,
      drop_params: true,
      input_cost_per_token: 0,
      output_cost_per_token: 0,
      guardrails: [],
      api_key: "secret",
    })
  })

  it("adds reasoning_effort for completions", () => {
    const result = buildLiteLLMParams({
      ...baseArgs,
      reasoningEffort: "low",
    })

    expect(result).toMatchObject({ reasoning_effort: "low" })
  })

  it("skips reasoning params for embeddings", () => {
    const result = buildLiteLLMParams({
      ...baseArgs,
      configType: AIConfigType.EMBEDDINGS,
      reasoningEffort: "high",
    })

    expect(result).not.toHaveProperty("reasoning_effort")
    expect(result).not.toHaveProperty("extra_body")
  })

  it("normalizes groq qwen3-32b effort to default", () => {
    const result = buildLiteLLMParams({
      provider: "groq",
      name: "qwen3-32b",
      credentialFields: {},
      configType: AIConfigType.COMPLETIONS,
      reasoningEffort: "high",
    })

    expect(result).toMatchObject({ reasoning_effort: "default" })
  })

  it("adds openrouter reasoning extra_body", () => {
    const result = buildLiteLLMParams({
      provider: "openrouter",
      name: "some-model",
      credentialFields: {},
      configType: AIConfigType.COMPLETIONS,
      reasoningEffort: "medium",
    })

    expect(result).toMatchObject({
      reasoning_effort: "medium",
      extra_body: { include_reasoning: true },
    })
  })
})
