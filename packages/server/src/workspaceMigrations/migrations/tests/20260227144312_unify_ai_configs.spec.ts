import { configs, db, docIds, HTTPError } from "@budibase/backend-core"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  ConfigType,
} from "@budibase/types"
import * as setup from "../../../api/routes/tests/utilities"
import * as aiConfigs from "../../../sdk/workspace/ai/configs"
import { LiteLLMStatus } from "../../../sdk/workspace/ai/configs/litellm"
import migration, {
  AIConfig,
  defaultModelByProvider,
  ProviderConfig,
} from "../20260227144312_unify_ai_configs"

jest.mock("../../../sdk/workspace/ai/configs", () => {
  const actual = jest.requireActual("../../../sdk/workspace/ai/configs")
  return {
    ...actual,
    create: jest.fn(),
    getLiteLLMStatus: jest.fn(),
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
    const getLiteLLMStatusMock =
      aiConfigs.getLiteLLMStatus as jest.MockedFunction<
        typeof aiConfigs.getLiteLLMStatus
      >
    getLiteLLMStatusMock.mockResolvedValue(LiteLLMStatus.OK)
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
      model: defaultModelByProvider.OpenAI,
      credentialsFields: {
        api_key: "sk-test",
        api_base: "https://api.openai.com/v1",
      },
      configType: AIConfigType.COMPLETIONS,
      isDefault: true,
    })
  })

  it("skips the migration when LiteLLM is not configured", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        openai: {
          provider: "OpenAI",
          name: "OpenAI",
          active: true,
          isDefault: true,
          apiKey: "sk-test",
        },
      },
    }
    await config.doInTenant(async () => {
      await configs.save(legacyConfig)
    })

    const getLiteLLMStatusMock =
      aiConfigs.getLiteLLMStatus as jest.MockedFunction<
        typeof aiConfigs.getLiteLLMStatus
      >
    getLiteLLMStatusMock.mockResolvedValue(LiteLLMStatus.NOT_CONFIGURED)

    const createMock = aiConfigs.create as jest.MockedFunction<
      typeof aiConfigs.create
    >
    createMock.mockResolvedValue({} as any)

    await config.doInContext(config.getDevWorkspaceId(), migration)

    expect(createMock).not.toHaveBeenCalled()
  })

  it("does not create configs when matching name already exist", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        openai: {
          provider: "OpenAI",
          name: "Existing OpenAI",
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
        model: `budibase/legacy/${defaultModelByProvider.BudibaseAI}`,
        credentialsFields: {},
      })
    )
  })

  it("does not create Budibase AI config when one already exists with a different name", async () => {
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

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await db.getDB(config.getDevWorkspaceId()).put({
        _id: docIds.generateAIConfigID("bbai"),
        name: "Existing Budibase AI",
        provider: BUDIBASE_AI_PROVIDER_ID,
        model: "budibase/legacy/gpt-5-mini",
        credentialsFields: {},
        liteLLMModelId: "existing-model-id",
        configType: AIConfigType.COMPLETIONS,
        isDefault: true,
      })
    })

    await config.doInContext(config.getDevWorkspaceId(), migration)

    expect(createMock).not.toHaveBeenCalled()
  })

  it("maps legacy AzureOpenAI provider to Azure", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        azure: {
          provider: "AzureOpenAI",
          name: "Azure OpenAI",
          active: true,
          isDefault: true,
          apiKey: "azure-key",
          baseUrl:
            "https://example.openai.azure.com/openai/deployments/gpt-4.1?api-version=2024-10-21",
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
        provider: "Azure",
        model: defaultModelByProvider.AzureOpenAI,
        credentialsFields: {
          api_key: "azure-key",
          api_base: "https://example.openai.azure.com",
        },
      })
    )
  })

  it("attempts migrating active legacy providers beyond OpenAI/BudibaseAI/AzureOpenAI", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        anthropic: {
          provider: "Anthropic",
          name: "Anthropic",
          active: true,
          isDefault: true,
          apiKey: "anthropic-key",
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
        provider: "Anthropic",
        model: defaultModelByProvider.Anthropic,
        credentialsFields: {
          api_key: "anthropic-key",
        },
      })
    )
  })

  it("skips invalid configs and continues migrating other providers", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        badConfig: {
          provider: "Custom",
          name: "Invalid custom",
          active: true,
          isDefault: true,
          defaultModel: "bad-model",
          apiKey: "bad-key",
        },
        openai: {
          provider: "OpenAI",
          name: "OpenAI",
          active: true,
          isDefault: false,
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
    createMock
      .mockRejectedValueOnce(new HTTPError("invalid configuration", 400))
      .mockResolvedValue({} as any)

    await config.doInContext(config.getDevWorkspaceId(), migration)

    expect(createMock).toHaveBeenCalledTimes(2)
    expect(createMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        provider: "OpenAI",
        model: defaultModelByProvider.OpenAI,
      })
    )
  })

  it("normalizes OpenAI base url to /v1 when using api.openai.com root", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        openai: {
          provider: "OpenAI",
          name: "OpenAI",
          active: true,
          isDefault: true,
          apiKey: "sk-test",
          baseUrl: "https://api.openai.com/",
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

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        credentialsFields: expect.objectContaining({
          api_base: "https://api.openai.com/v1",
        }),
      })
    )
  })

  it("does not double-prefix budibase legacy model", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        bbai: {
          provider: "BudibaseAI",
          name: "Budibase AI",
          active: true,
          isDefault: true,
          defaultModel: "budibase/legacy/gpt-5-mini",
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

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: BUDIBASE_AI_PROVIDER_ID,
        model: "budibase/legacy/gpt-5-mini",
      })
    )
  })

  it("rethrows non-400 errors from config creation", async () => {
    const legacyConfig: AIConfig = {
      type: ConfigType.AI,
      config: {
        openai: {
          provider: "OpenAI",
          name: "OpenAI",
          active: true,
          isDefault: true,
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
    createMock.mockRejectedValue(new HTTPError("upstream failure", 500))

    await expect(
      config.doInContext(config.getDevWorkspaceId(), migration)
    ).rejects.toThrow("upstream failure")
  })

  it("skips providers with no model available and continues", async () => {
    const legacyConfig = {
      type: ConfigType.AI,
      config: {
        unknownNoModel: {
          provider: "UnknownProvider",
          name: "Unknown",
          active: true,
          isDefault: true,
        },
        openai: {
          provider: "OpenAI",
          name: "OpenAI",
          active: true,
          isDefault: false,
          apiKey: "sk-test",
        },
      },
    } as unknown as AIConfig
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
        provider: "OpenAI",
      })
    )
  })
})
