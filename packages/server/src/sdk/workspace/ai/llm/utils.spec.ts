import { BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
import {
  fetchPublicModelCostMap,
  fetchPublicProviders,
} from "../configs/litellm"
import { supportsReasoningEffort } from "./utils"

jest.mock("../configs/litellm", () => ({
  fetchPublicProviders: jest.fn(),
  fetchPublicModelCostMap: jest.fn(),
}))

describe("supportsReasoningEffort", () => {
  const fetchPublicProvidersMock = fetchPublicProviders as jest.MockedFunction<
    typeof fetchPublicProviders
  >
  const fetchPublicModelCostMapMock =
    fetchPublicModelCostMap as jest.MockedFunction<
      typeof fetchPublicModelCostMap
    >

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("returns true for Budibase AI provider without fetching LiteLLM metadata", async () => {
    const result = await supportsReasoningEffort({
      provider: BUDIBASE_AI_PROVIDER_ID,
      model: "gpt-5-mini",
    })

    expect(result).toBe(true)
    expect(fetchPublicProvidersMock).not.toHaveBeenCalled()
    expect(fetchPublicModelCostMapMock).not.toHaveBeenCalled()
  })

  it("returns false when provider is not found in public providers", async () => {
    fetchPublicProvidersMock.mockResolvedValue([
      {
        provider: "anthropic",
        provider_display_name: "Anthropic",
        litellm_provider: "anthropic",
        credential_fields: [],
      },
    ])
    fetchPublicModelCostMapMock.mockResolvedValue({})

    const result = await supportsReasoningEffort({
      provider: "openai",
      model: "gpt-5-mini",
    })

    expect(result).toBe(false)
  })

  it("returns true when model id has provider prefix and supports reasoning", async () => {
    fetchPublicProvidersMock.mockResolvedValue([
      {
        provider: "openai",
        provider_display_name: "OpenAI",
        litellm_provider: "openai",
        credential_fields: [],
      },
    ])
    fetchPublicModelCostMapMock.mockResolvedValue({
      "openai/gpt-5-mini": {
        litellm_provider: ["openai"],
        supports_reasoning: true,
      },
    })

    const result = await supportsReasoningEffort({
      provider: "openai",
      model: "gpt-5-mini",
    })

    expect(result).toBe(true)
  })

  it("returns true when litellm provider is a comma-separated string", async () => {
    fetchPublicProvidersMock.mockResolvedValue([
      {
        provider: "openai",
        provider_display_name: "OpenAI",
        litellm_provider: "openai",
        credential_fields: [],
      },
    ])
    fetchPublicModelCostMapMock.mockResolvedValue({
      "gpt-5": {
        litellm_provider: "openai, azure",
        supports_reasoning: true,
      },
    })

    const result = await supportsReasoningEffort({
      provider: "openai",
      model: "gpt-5",
    })

    expect(result).toBe(true)
  })

  it("returns false when model supports_reasoning is not true", async () => {
    fetchPublicProvidersMock.mockResolvedValue([
      {
        provider: "openai",
        provider_display_name: "OpenAI",
        litellm_provider: "openai",
        credential_fields: [],
      },
    ])
    fetchPublicModelCostMapMock.mockResolvedValue({
      "openai/gpt-5-mini": {
        litellm_provider: "openai",
        supports_reasoning: false,
      },
    })

    const result = await supportsReasoningEffort({
      provider: "openai",
      model: "gpt-5-mini",
    })

    expect(result).toBe(false)
  })
})
