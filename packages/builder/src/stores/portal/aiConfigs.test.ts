import { describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import { AIConfigType, type AIConfigResponse } from "@budibase/types"
import { AIConfigStore } from "./aiConfigs"

vi.mock("@/api", () => ({
  API: {
    aiConfig: {
      fetch: async () => [],
    },
  },
}))

const makeConfig = (
  overrides: Partial<AIConfigResponse> = {}
): AIConfigResponse => ({
  _id: "cfg_1",
  _rev: "1-test",
  name: "test config",
  provider: "OpenAI",
  model: "gpt-5-mini",
  isDefault: false,
  webSearchConfig: undefined,
  configType: AIConfigType.COMPLETIONS,
  reasoningEffort: undefined,
  credentialsFields: {},
  ...overrides,
})

describe("AIConfigStore", () => {
  it("groups known config types and ignores unsupported ones", () => {
    const store = new AIConfigStore()
    const completionsConfig = makeConfig()
    const unsupportedConfig = makeConfig({
      _id: "cfg_2",
      configType: "embeddings" as AIConfigType,
    })
    const missingTypeConfig = makeConfig({
      _id: "cfg_3",
      configType: undefined as AIConfigType,
    })

    store.set({
      customConfigs: [completionsConfig, unsupportedConfig, missingTypeConfig],
      providers: undefined,
    })

    const state = get(store)

    expect(state.customConfigsPerType.completions).toEqual([completionsConfig])
  })
})
