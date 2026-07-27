const mockDbPut = jest.fn().mockResolvedValue({ rev: "1-abc" })
const mockDbGet = jest.fn()
const mockDbTryGet = jest.fn()
const mockDbRemove = jest.fn()
const mockGetWorkspaceDB = jest.fn(() => ({
  put: (...args: any[]) => mockDbPut(...args),
  get: (...args: any[]) => mockDbGet(...args),
  tryGet: (...args: any[]) => mockDbTryGet(...args),
  remove: (...args: any[]) => mockDbRemove(...args),
}))

const mockConfigCreated = jest.fn()
const mockConfigUpdated = jest.fn()
const mockConfigDeleted = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
    },
    env: {
      ...actual.env,
      SELF_HOSTED: false,
      BUDICLOUD_URL: "http://budicloud.example.com",
    },
    events: {
      ...actual.events,
      ai: {
        configCreated: (...args: any[]) => mockConfigCreated(...args),
        configUpdated: (...args: any[]) => mockConfigUpdated(...args),
        configDeleted: (...args: any[]) => mockConfigDeleted(...args),
      },
    },
  }
})

jest.mock("@budibase/pro", () => ({
  licensing: {
    keys: { getLicenseKey: jest.fn() },
  },
}))

jest.mock("./litellm", () => ({
  validateConfig: jest.fn(),
  addModel: jest.fn().mockResolvedValue("model_123"),
  updateModel: jest.fn(),
  syncKeyModels: jest.fn(),
  fetchPublicProviders: jest.fn().mockResolvedValue([]),
  fetchPublicModelCostMap: jest.fn().mockResolvedValue({}),
}))

jest.mock("../../../utils", () => ({
  processEnvironmentVariable: jest.fn((v: string) => v),
}))

import type { CustomAIProviderConfig } from "@budibase/types"
import { AIConfigType } from "@budibase/types"
import * as aiConfigs from "./index"

const baseConfig = {
  name: "My Config",
  provider: "openai",
  model: "gpt-4",
  credentialsFields: { api_key: "sk-test" },
  configType: AIConfigType.COMPLETIONS,
  isDefault: false,
} as const

describe("ai configs sdk", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDbPut.mockResolvedValue({ rev: "1-abc" })
  })

  describe("create", () => {
    it("emits ai:config:created event", async () => {
      await aiConfigs.create(baseConfig)

      expect(mockConfigCreated).toHaveBeenCalledWith(
        expect.objectContaining({ name: "My Config" })
      )
    })
  })

  describe("update", () => {
    it("emits ai:config:updated event", async () => {
      const existing: CustomAIProviderConfig = {
        _id: "cfg_1",
        _rev: "1-abc",
        name: "My Config",
        provider: "openai",
        model: "gpt-4",
        credentialsFields: { api_key: "sk-test" },
        configType: AIConfigType.COMPLETIONS,
        isDefault: false,
        liteLLMModelId: "model_123",
      }

      mockDbTryGet.mockResolvedValue(existing)
      mockDbPut.mockResolvedValue({ rev: "2-abc" })

      await aiConfigs.update({ ...existing })

      expect(mockConfigUpdated).toHaveBeenCalledWith(
        expect.objectContaining({ _id: "cfg_1", name: "My Config" })
      )
    })
  })

  describe("remove", () => {
    it("emits ai:config:deleted event after deletion", async () => {
      const existing: CustomAIProviderConfig = {
        _id: "cfg_del",
        _rev: "1-abc",
        name: "Config to delete",
        provider: "openai",
        model: "gpt-4",
        credentialsFields: {},
        configType: AIConfigType.COMPLETIONS,
        isDefault: false,
        liteLLMModelId: "model_123",
      }

      mockDbGet.mockResolvedValue(existing)

      await aiConfigs.remove("cfg_del")

      expect(mockConfigDeleted).toHaveBeenCalledWith(
        expect.objectContaining({ _id: "cfg_del", name: "Config to delete" })
      )
    })
  })
})
