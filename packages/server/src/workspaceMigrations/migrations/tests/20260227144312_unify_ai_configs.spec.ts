import { configs, db, docIds } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  AIConfig,
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  ConfigType,
  ProviderConfig,
} from "@budibase/types"
import * as setup from "../../../api/routes/tests/utilities"
import * as aiConfigs from "../../../sdk/workspace/ai/configs"
import migration from "../20260227144312_unify_ai_configs"

jest.mock("../../../sdk/workspace/ai/configs", () => {
  const actual = jest.requireActual("../../../sdk/workspace/ai/configs")
  return {
    ...actual,
    create: jest.fn(),
  }
})

const config = setup.getConfig()

describe("20260227144312_unify_ai_configs", () => {
  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("creates new completions configs from active legacy providers", async () => {
    const legacyProviders: Record<string, ProviderConfig> = {
      openai: {
        provider: "OpenAI",
        name: "OpenAI",
        active: true,
        isDefault: true,
        apiKey: "sk-test",
        baseUrl: "https://api.openai.com/v1",
      },
      bbai: {
        provider: "BudibaseAI",
        name: "Budibase AI",
        active: false,
        isDefault: false,
      },
      disabled: {
        provider: "Anthropic",
        name: "Anthropic",
        active: false,
        isDefault: false,
      },
    }
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: legacyProviders,
    }
    await config.doInTenant(async () => {
      await configs.save(legacyConfig)
    })
    const createMock = aiConfigs.create as jest.MockedFunction<
      typeof aiConfigs.create
    >
    createMock.mockResolvedValue({} as any)

    await config.doInContext(config.getDevWorkspaceId(), migration)

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith({
      name: "OpenAI",
      provider: "OpenAI",
      model: ai.DefaultModelByProvider.OpenAI,
      credentialsFields: {
        api_key: "sk-test",
        api_base: "https://api.openai.com/v1",
      },
      configType: AIConfigType.COMPLETIONS,
      isDefault: true,
    })
  })

  it("does not create configs when matching signatures already exist", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        openai: {
          provider: "OpenAI",
          name: "OpenAI",
          active: true,
          isDefault: true,
          defaultModel: "gpt-5-mini",
          apiKey: "sk-test",
        },
      },
    }
    await config.doInTenant(async () => {
      await configs.save(legacyConfig)
    })

    const createMock = aiConfigs.create as jest.MockedFunction<
      typeof aiConfigs.create
    >
    createMock.mockResolvedValue({} as any)
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await db.getDB(config.getDevWorkspaceId()).put({
        _id: docIds.generateAIConfigID("existing-openai"),
        name: "Existing OpenAI",
        provider: "OpenAI",
        model: "gpt-5-mini",
        credentialsFields: {
          api_key: "existing-key",
          api_base: "https://api.openai.com/v1",
        },
        liteLLMModelId: "existing-model-id",
        configType: AIConfigType.COMPLETIONS,
        isDefault: true,
      })
    })

    await config.doInContext(config.getDevWorkspaceId(), migration)

    expect(createMock).not.toHaveBeenCalled()
  })

  it("maps legacy BudibaseAI provider to the new Budibase provider ID", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        bbai: {
          provider: "BudibaseAI",
          name: "Budibase AI",
          active: true,
          isDefault: true,
        },
      },
    }
    await config.doInTenant(async () => {
      await configs.save(legacyConfig)
    })

    const createMock = aiConfigs.create as jest.MockedFunction<
      typeof aiConfigs.create
    >
    createMock.mockResolvedValue({} as any)

    await config.doInContext(config.getDevWorkspaceId(), migration)

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: BUDIBASE_AI_PROVIDER_ID,
        model: `budibase/legacy/${ai.DefaultModelByProvider.BudibaseAI}`,
        credentialsFields: {},
      })
    )
  })
})
