import { TestConfiguration } from "../../../../tests"
import { AIConfig, ConfigType } from "@budibase/types"
import { configs, context } from "@budibase/backend-core"

const BASE_CONFIG: AIConfig = {
  type: ConfigType.AI,
  config: {
    ai: {
      provider: "OpenAI",
      isDefault: false,
      name: "Test",
      active: true,
      defaultModel: "gpt4",
      apiKey: "myapikey",
      baseUrl: "https://api.example.com",
    },
  },
}

describe("Global configs controller", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("should strip secrets when pulling AI config", async () => {
    await config.api.configs.saveConfig(BASE_CONFIG)
    const response = await config.api.configs.getAIConfig()
    expect(response.config.ai.apiKey).toEqual("--secret-value--")
  })

  it("should not update existing secrets when updating an existing AI Config", async () => {
    await config.api.configs.saveConfig(BASE_CONFIG)

    const savedConfig = await config.api.configs.getAIConfig()
    delete savedConfig._id
    delete savedConfig._rev
    delete savedConfig.createdAt
    delete savedConfig.updatedAt

    await config.api.configs.saveConfig(savedConfig)

    await context.doInTenant(config.tenantId, async () => {
      const aiConfig = await configs.getAIConfig()
      expect(aiConfig!.config.ai.apiKey).toEqual(BASE_CONFIG.config.ai.apiKey)
    })
  })

  it("should allow BudibaseAI to save without an apiKey", async () => {
    await config.api.configs.saveConfig({
      type: ConfigType.AI,
      config: {
        ai: {
          name: "Budibase AI",
          active: true,
          provider: "BudibaseAI",
          isDefault: true,
        },
      },
    })

    const aiConfig = await config.api.configs.getAIConfig()
    expect(aiConfig.config.ai).toEqual({
      name: "Budibase AI",
      provider: "BudibaseAI",
      active: true,
      isDefault: true,
    })
  })

  it("should not allow OpenAI to save without an apiKey", async () => {
    await config.api.configs.saveConfig(
      {
        type: ConfigType.AI,
        config: {
          ai: {
            name: "OpenAI",
            active: true,
            provider: "OpenAI",
            isDefault: true,
          },
        },
      },
      {
        status: 400,
        body: {
          message: /API key is required for provider OpenAI/,
        },
      }
    )
  })
})
